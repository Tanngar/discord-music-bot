import { AudioPlayerStatus } from '@discordjs/voice';
import youtube from 'play-dl';
import { Command } from '.';
import { Track } from '../client/session';
import { escapeMarkdown } from '../utils';

const Play: Command = {
  name: 'play',
  description: 'Adds track to the queue.',
  aliases: ['p'],
  async execute(session, _, args) {
    const { textChannel, player, queue } = session;

    if (!args?.length) {
      textChannel.send('Enter your search query after -play command.');
      return;
    }

    let tracks: Track[] = [];

    const isVideoURL = youtube.yt_validate(args[0]) === 'video';

    const isPlaylistURL = youtube.yt_validate(args[0]) === 'playlist';

    try {
      if (isVideoURL) {
        const track = await getVideoByURL(args[0]);
        tracks.push(track);
      } else if (isPlaylistURL) {
        const playlist = await getPlaylistByURL(args[0]);
        tracks = playlist;
      } else {
        const isVideoFound = await youtube
          .search(args.join(''))
          .then((res) => res.length);

        if (isVideoFound) {
          const track = await getVideoBySearchQuery(args.join(''));
          tracks.push(track);
        } else {
          textChannel.send('No video results found.');
          return;
        }
      }
    } catch (error) {
      console.error(error);
      textChannel.send('There was a problem with the request.');
      return;
    }

    session.addToQueue(tracks);

    if (isPlaylistURL) {
      textChannel.send(
        `${tracks.length} tracks added to the queue from the playlist.`
      );
    } else {
      textChannel.send(
        `Track added to the queue: **${escapeMarkdown(tracks[0].title)} [${
          tracks[0].length
        }]**\n${queue.length} track(s) in the queue.`
      );
    }

    if (player.state.status !== AudioPlayerStatus.Playing)
      session.play(queue[0]);
  },
};

const getVideoByURL = async (url: string) => {
  const videoInfo = await youtube
    .video_basic_info(url)
    .then((res) => res.video_details);

  const track: Track = {
    title: videoInfo.title ? videoInfo.title : 'No title',
    url: videoInfo.url,
    length: videoInfo.live ? 'Live' : videoInfo.durationRaw,
  };

  return track;
};

const getPlaylistByURL = async (url: string) => {
  const playlistInfo = await youtube.playlist_info(url);
  const playlist = await playlistInfo.fetch();
  const videos = await playlist.all_videos();

  videos.forEach((video) => {
    if (video.private) console.log(video);
  });

  const tracks: Track[] = [];

  videos.forEach((video) => {
    const track: Track = {
      title: video.title ? video.title : 'No title',
      url: video.url,
      length: video.durationRaw,
    };

    tracks.push(track);
  });

  return tracks;
};

const getVideoBySearchQuery = async (args: string) => {
  const video = await youtube.search(args);

  const track: Track = {
    title: video[0].title ? video[0].title : 'No title',
    url: video[0].url,
    length: video[0].live ? 'Live' : video[0].durationRaw,
  };

  return track;
};

export default Play;
