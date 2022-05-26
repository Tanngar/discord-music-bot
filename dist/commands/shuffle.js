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
Object.defineProperty(exports, "__esModule", { value: true });
const Shuffle = {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    aliases: ['sh'],
    execute(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { textChannel, queue } = session;
            if (queue.length < 1) {
                textChannel.send('There are no tracks in the queue.');
                return;
            }
            if (queue.length < 2) {
                textChannel.send('There are less than 2 tracks in the queue.');
                return;
            }
            session.shuffleQueue();
            textChannel.send('Shuffled.');
        });
    },
};
exports.default = Shuffle;
