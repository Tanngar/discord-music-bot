"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Track = {
    name: 'track',
    description: 'Displays URL for the current track.',
    aliases: ['t'],
    execute(session) {
        const { textChannel, queue } = session;
        const currentTrack = queue[0];
        textChannel.send(currentTrack.url);
    },
};
exports.default = Track;
