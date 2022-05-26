"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const utils_1 = require("../utils");
class ExtendedClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.commands = new discord_js_1.Collection();
        this.sessions = new discord_js_1.Collection();
        this.loadCommands();
        this.on('voiceStateUpdate', (newState) => this.voiceStateUpdateHandler(newState));
        this.login(process.env.DISCORD_BOT_TOKEN);
    }
    loadCommands() {
        const commandsPath = path_1.default.join(__dirname, '..', 'commands');
        const files = (0, fs_1.readdirSync)(commandsPath).filter((dir) => !dir.includes('index'));
        files.forEach((file) => {
            // eslint-disable-next-line
            const command = require(`${commandsPath}/${file}`).default;
            this.commands.set(command.name, command);
        });
    }
    voiceStateUpdateHandler(newState) {
        const session = this.sessions.get(newState.guild.id);
        if (!session)
            return;
        const numOfMembers = session.voiceChannel.members.size;
        if (numOfMembers > 1) {
            if (session.emptyVoiceChannelTimeout)
                clearTimeout(session.emptyVoiceChannelTimeout);
        }
        else {
            const timerInMinutes = 2;
            session.emptyVoiceChannelTimeout = setTimeout(() => {
                session.connection.destroy();
            }, timerInMinutes * utils_1.SECONDS_IN_MINUTE * utils_1.MILLISECONDS_IN_SECOND);
        }
    }
    getCommand(commandName) {
        const command = this.commands.get(commandName) ||
            this.commands.find((collection) => collection.aliases && collection.aliases.includes(commandName));
        return command;
    }
    addSession(session) {
        this.sessions.set(session.guildId, session);
    }
}
exports.default = ExtendedClient;
