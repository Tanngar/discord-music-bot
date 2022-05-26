import { Client, ClientOptions, Collection, VoiceState } from 'discord.js';
import path from 'path';
import { readdirSync } from 'fs';
import { Command } from '../commands';
import Session from './session';
import { MILLISECONDS_IN_SECOND, SECONDS_IN_MINUTE } from '../utils';

export default class ExtendedClient extends Client {
  public commands: Collection<string, Command> = new Collection();

  public sessions: Collection<string, Session> = new Collection();

  constructor(options: ClientOptions) {
    super(options);
    this.loadCommands();

    this.on('voiceStateUpdate', (newState) =>
      this.voiceStateUpdateHandler(newState)
    );

    this.login(process.env.DISCORD_BOT_TOKEN);
  }

  loadCommands() {
    const commandsPath = path.join(__dirname, '..', 'commands');

    const files = readdirSync(commandsPath).filter(
      (dir) => !dir.includes('index')
    );

    files.forEach((file) => {
      // eslint-disable-next-line
      const command = require(`${commandsPath}/${file}`).default;

      this.commands.set(command.name, command);
    });
  }

  voiceStateUpdateHandler(newState: VoiceState) {
    const session = this.sessions.get(newState.guild.id);

    if (!session) return;

    const numOfMembers = session.voiceChannel.members.size;

    if (numOfMembers > 1) {
      if (session.emptyVoiceChannelTimeout)
        clearTimeout(session.emptyVoiceChannelTimeout);
    } else {
      const timerInMinutes = 2;

      session.emptyVoiceChannelTimeout = setTimeout(() => {
        session.connection.destroy();
      }, timerInMinutes * SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND);
    }
  }

  getCommand(commandName: string) {
    const command =
      this.commands.get(commandName) ||
      this.commands.find(
        (collection) =>
          collection.aliases && collection.aliases.includes(commandName)
      );

    return command;
  }

  addSession(session: Session) {
    this.sessions.set(session.guildId, session);
  }
}
