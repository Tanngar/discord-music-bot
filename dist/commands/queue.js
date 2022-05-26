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
const utils_1 = require("../utils");
const Queue = {
    name: 'queue',
    description: 'Displays the queue.',
    aliases: ['q'],
    execute(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const { textChannel, queue } = session;
            if (queue.length < 1) {
                textChannel.send('There are no tracks in the queue.');
                return;
            }
            const firstLine = `${queue.length} track(s) in the queue:\n`;
            const charLimit = 2000;
            const sections = [];
            let content = '';
            let contentLength = 0;
            for (let i = 0; i < queue.length; i++) {
                const line = `**${i + 1}. ${(0, utils_1.escapeMarkdown)(queue[i].title)} [${queue[i].length}]**\n`;
                if (contentLength + line.length < charLimit) {
                    content += line;
                }
                else {
                    sections.push(content);
                    contentLength = 0;
                    content = '';
                    content += line;
                }
                contentLength += line.length;
                if (i === queue.length - 1) {
                    sections.push(content);
                }
            }
            textChannel.send(firstLine);
            sections.forEach((section) => {
                textChannel.send(section);
            });
        });
    },
};
exports.default = Queue;
