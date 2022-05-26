"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voice_1 = require("@discordjs/voice");
const play_dl_1 = __importDefault(require("play-dl"));
const utils_1 = require("../utils");
class Session {
    constructor(guildId, textChannel, voiceChannel, adapterCreator) {
        this.queue = [];
        this.guildId = guildId;
        this.connection = (0, voice_1.joinVoiceChannel)({
            channelId: voiceChannel.id,
            guildId,
            adapterCreator,
        });
        this.player = (0, voice_1.createAudioPlayer)();
        this.connection.subscribe(this.player);
        this.textChannel = textChannel;
        this.voiceChannel = voiceChannel;
        this.player.on('stateChange', (oldState, newState) => this.stateChangeHandler(oldState, newState));
    }
    stateChangeHandler(oldState, newState) {
        if (newState.status === voice_1.AudioPlayerStatus.Idle &&
            oldState.status !== voice_1.AudioPlayerStatus.Idle) {
            this.queue.shift();
            if (!this.queue.length) {
                const timerInMinutes = 20;
                this.inactivityTimeout = setTimeout(() => {
                    this.textChannel.send('Leaving due to inactivity. :cry:');
                    this.connection.destroy();
                }, timerInMinutes * utils_1.SECONDS_IN_MINUTE * utils_1.MILLISECONDS_IN_SECOND);
            }
            if (this.queue.length) {
                this.play(this.queue[0]);
            }
        }
    }
    play(track) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.inactivityTimeout)
                clearTimeout(this.inactivityTimeout);
            const source = yield play_dl_1.default.stream(track.url);
            const resource = (0, voice_1.createAudioResource)(source.stream, {
                inputType: source.type,
            });
            this.player.play(resource);
            this.textChannel.send(`Playing: **${(0, utils_1.escapeMarkdown)(track.title)}" [${track.length}]**`);
        });
    }
    addToQueue(tracks) {
        tracks.forEach((track) => {
            this.queue.push(track);
        });
    }
    shuffleQueue() {
        const currentTrack = this.queue.shift();
        if (!currentTrack)
            return;
        this.queue = [currentTrack, ...(0, utils_1.shuffleArray)(this.queue)];
    }
    clearQueueAndStopAudioPlayer() {
        this.queue = [];
        this.player.stop();
    }
}
exports.default = Session;
