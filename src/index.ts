import { DiscordGatewayAdapterCreator } from '@discordjs/voice';
import { Intents, Message, Permissions, TextChannel } from 'discord.js';
import dotenv from 'dotenv';
import youtube from 'play-dl';
import Client from './client';
import Session from './client/session';

dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

if (process.env.YOUTUBE_TOKEN) {
  youtube.setToken({
    youtube: {
      cookie: process.env.YOUTUBE_TOKEN,
    },
  });
}

const prefix = '-';

client.on('messageCreate', (message) => messageHandler(message));
client.on('unhandledRejection', (error) => unhandledRejectionHandler(error));

const messageHandler = (message: Message) => {
  if (
    message.author.bot ||
    !message.content.startsWith(prefix) ||
    !message.guild?.me ||
    !message.guildId
  )
    return;

  const { guildId } = message;
  const textChannel = message.channel as TextChannel;
  const voiceChannel = message.member?.voice.channel;

  if (!voiceChannel) {
    textChannel.send('You must be in the voice channel.');
    return;
  }

  let session = client.sessions.get(guildId);

  if (!session) {
    session = new Session(
      guildId,
      textChannel,
      voiceChannel,
      message.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator
    );

    client.addSession(session);
  }

  if (
    message.guild.me.voice.channel &&
    voiceChannel.id !== message.guild.me.voice.channel.id
  ) {
    textChannel.send('You must be in the same voice channel as me.');
    return;
  }

  const { permissions } = message.member;

  if (
    !permissions.has(Permissions.FLAGS.SPEAK) ||
    !permissions.has(Permissions.FLAGS.CONNECT)
  ) {
    textChannel.send("You don't have the correct permissions.");
    return;
  }

  const args = message.content.slice(prefix.length).split(/ +/);

  if (args.length < 1) {
    textChannel.send(
      'Invalid command. Use -help to see the list of available commands.'
    );
    return;
  }

  const firstArg = args?.shift()?.toLowerCase();

  if (!firstArg) return;

  const command = client.getCommand(firstArg);

  if (!command) return;

  command.execute(session, client, args);
};

const unhandledRejectionHandler = (error: Error) => {
  console.error(error);
};
