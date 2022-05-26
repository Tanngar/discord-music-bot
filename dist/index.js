"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const play_dl_1 = __importDefault(require("play-dl"));
const client_1 = __importDefault(require("./client"));
const session_1 = __importDefault(require("./client/session"));
dotenv_1.default.config();
const client = new client_1.default({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
if (process.env.YOUTUBE_TOKEN) {
    play_dl_1.default.setToken({
        youtube: {
            cookie: process.env.YOUTUBE_TOKEN,
        },
    });
}
const prefix = '-';
client.on('messageCreate', (message) => messageHandler(message));
client.on('unhandledRejection', (error) => unhandledRejectionHandler(error));
const messageHandler = (message) => {
    var _a, _b, _c;
    if (message.author.bot ||
        !message.content.startsWith(prefix) ||
        !((_a = message.guild) === null || _a === void 0 ? void 0 : _a.me) ||
        !message.guildId)
        return;
    const { guildId } = message;
    const textChannel = message.channel;
    const voiceChannel = (_b = message.member) === null || _b === void 0 ? void 0 : _b.voice.channel;
    if (!voiceChannel) {
        textChannel.send('You must be in the voice channel.');
        return;
    }
    let session = client.sessions.get(guildId);
    if (!session) {
        session = new session_1.default(guildId, textChannel, voiceChannel, message.guild.voiceAdapterCreator);
        client.addSession(session);
    }
    if (message.guild.me.voice.channel &&
        voiceChannel.id !== message.guild.me.voice.channel.id) {
        textChannel.send('You must be in the same voice channel as me.');
        return;
    }
    const { permissions } = message.member;
    if (!permissions.has(discord_js_1.Permissions.FLAGS.SPEAK) ||
        !permissions.has(discord_js_1.Permissions.FLAGS.CONNECT)) {
        textChannel.send("You don't have the correct permissions.");
        return;
    }
    const args = message.content.slice(prefix.length).split(/ +/);
    if (args.length < 1) {
        textChannel.send('Invalid command. Use -help to see the list of available commands.');
        return;
    }
    const firstArg = (_c = args === null || args === void 0 ? void 0 : args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
    if (!firstArg)
        return;
    const command = client.getCommand(firstArg);
    if (!command)
        return;
    command.execute(session, client, args);
};
const unhandledRejectionHandler = (error) => {
    console.error(error);
};
