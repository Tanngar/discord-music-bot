"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeMarkdown = exports.shuffleArray = exports.SECONDS_IN_HOUR = exports.SECONDS_IN_MINUTE = exports.MILLISECONDS_IN_SECOND = void 0;
exports.MILLISECONDS_IN_SECOND = 1000;
exports.SECONDS_IN_MINUTE = 60;
exports.SECONDS_IN_HOUR = 3600;
const shuffleArray = (array) => {
    const newArray = array;
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};
exports.shuffleArray = shuffleArray;
// prettier-ignore
const escapeMarkdown = (text) => text.replace('**', '\\**');
exports.escapeMarkdown = escapeMarkdown;
