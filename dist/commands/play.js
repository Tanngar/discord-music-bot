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
const Play = {
    name: 'play',
    description: 'Adds track to the queue.',
    aliases: ['p'],
    execute(session, _, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const { textChannel, player, queue } = session;
            if (!(args === null || args === void 0 ? void 0 : args.length)) {
                textChannel.send('Enter your search query after -play command.');
                return;
            }
            let tracks = [];
            const isVideoURL = play_dl_1.default.yt_validate(args[0]) === 'video';
            const isPlaylistURL = play_dl_1.default.yt_validate(args[0]) === 'playlist';
            try {
                if (isVideoURL) {
                    const track = yield getVideoByURL(args[0]);
                    tracks.push(track);
                }
                else if (isPlaylistURL) {
                    const playlist = yield getPlaylistByURL(args[0]);
                    tracks = playlist;
                }
                else {
                    const isVideoFound = yield play_dl_1.default
                        .search(args.join(''))
                        .then((res) => res.length);
                    if (isVideoFound) {
                        const track = yield getVideoBySearchQuery(args.join(''));
                        tracks.push(track);
                    }
                    else {
                        textChannel.send('No video results found.');
                        return;
                    }
                }
            }
            catch (error) {
                console.error(error);
                textChannel.send('There was a problem with the request.');
                return;
            }
            session.addToQueue(tracks);
            if (isPlaylistURL) {
                textChannel.send(`${tracks.length} tracks added to the queue from the playlist.`);
            }
            else {
                textChannel.send(`Track added to the queue: **${(0, utils_1.escapeMarkdown)(tracks[0].title)} [${tracks[0].length}]**\n${queue.length} track(s) in the queue.`);
            }
            if (player.state.status !== voice_1.AudioPlayerStatus.Playing)
                session.play(queue[0]);
        });
    },
};
const getVideoByURL = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const videoInfo = yield play_dl_1.default
        .video_basic_info(url)
        .then((res) => res.video_details);
    const track = {
        title: videoInfo.title ? videoInfo.title : 'No title',
        url: videoInfo.url,
        length: videoInfo.live ? 'Live' : videoInfo.durationRaw,
    };
    return track;
});
const getPlaylistByURL = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const playlistInfo = yield play_dl_1.default.playlist_info(url);
    const playlist = yield playlistInfo.fetch();
    const videos = yield playlist.all_videos();
    videos.forEach((video) => {
        if (video.private)
            console.log(video);
    });
    const tracks = [];
    videos.forEach((video) => {
        const track = {
            title: video.title ? video.title : 'No title',
            url: video.url,
            length: video.durationRaw,
        };
        tracks.push(track);
    });
    return tracks;
});
const getVideoBySearchQuery = (args) => __awaiter(void 0, void 0, void 0, function* () {
    const video = yield play_dl_1.default.search(args);
    const track = {
        title: video[0].title ? video[0].title : 'No title',
        url: video[0].url,
        length: video[0].live ? 'Live' : video[0].durationRaw,
    };
    return track;
});
exports.default = Play;
