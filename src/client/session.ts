import {
  AudioPlayer,
  createAudioPlayer,
  DiscordGatewayAdapterCreator,
  joinVoiceChannel,
  VoiceConnection,
  createAudioResource,
  AudioPlayerStatus,
  AudioPlayerState,
} from '@discordjs/voice';
import { TextChannel, VoiceBasedChannel } from 'discord.js';
import youtube from 'play-dl';
import {
  escapeMarkdown,
  MILLISECONDS_IN_SECOND,
  SECONDS_IN_MINUTE,
  shuffleArray,
} from '../utils';

export type Track = {
  title: string;
  url: string;
  length: number | string;
};

export default class Session {
  public guildId: string;

  public connection: VoiceConnection;

  public player: AudioPlayer;

  public queue: Track[] = [];

  public voiceChannel: VoiceBasedChannel;

  public textChannel: TextChannel;

  public inactivityTimeout!: NodeJS.Timeout;

  public emptyVoiceChannelTimeout!: NodeJS.Timeout;

  constructor(
    guildId: string,
    textChannel: TextChannel,
    voiceChannel: VoiceBasedChannel,
    adapterCreator: DiscordGatewayAdapterCreator
  ) {
    this.guildId = guildId;

    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId,
      adapterCreator,
    });

    this.player = createAudioPlayer();

    this.connection.subscribe(this.player);

    this.textChannel = textChannel;
    this.voiceChannel = voiceChannel;

    this.player.on<'stateChange'>('stateChange', (oldState, newState) =>
      this.stateChangeHandler(oldState, newState)
    );
  }

  stateChangeHandler(oldState: AudioPlayerState, newState: AudioPlayerState) {
    if (
      newState.status === AudioPlayerStatus.Idle &&
      oldState.status !== AudioPlayerStatus.Idle
    ) {
      this.queue.shift();

      if (!this.queue.length) {
        const timerInMinutes = 20;

        this.inactivityTimeout = setTimeout(() => {
          this.textChannel.send('Leaving due to inactivity. :cry:');
          this.connection.destroy();
        }, timerInMinutes * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND);
      }

      if (this.queue.length) {
        this.play(this.queue[0]);
      }
    }
  }

  async play(track: Track) {
    if (this.inactivityTimeout) clearTimeout(this.inactivityTimeout);

    const source = await youtube.stream(track.url);

    const resource = createAudioResource(source.stream, {
      inputType: source.type,
    });

    this.player.play(resource);

    this.textChannel.send(
      `Playing: **${escapeMarkdown(track.title)}" [${track.length}]**`
    );
  }

  addToQueue(tracks: Track[]) {
    tracks.forEach((track) => {
      this.queue.push(track);
    });
  }

  shuffleQueue() {
    const currentTrack = this.queue.shift();

    if(!currentTrack) return

    this.queue = [currentTrack, ...shuffleArray(this.queue)];
  }

  clearQueueAndStopAudioPlayer() {
    this.queue = [];
    this.player.stop();
  }
}
