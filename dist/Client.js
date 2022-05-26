"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
class ExtendedClient extends discord_js_1.Client {
    // public async init() {
    //   const commandPath = path.join(__dirname, '..', 'commands');
    //   console.log(readdirSync(commandPath));
    //   // readdirSync(commandPath).array.forEach((dir) => {
    //   //   const commands = readdirSync(`${commandPath}/${dir}`).filter(
    //   //     (file) => file.name !== 'types'
    //   //   );
    //   // });
    // }
    constructor(options) {
        super(options);
        this.login(process.env.DISCORD_BOT_TOKEN);
        this.queue = new Map();
        this.commands = new discord_js_1.Collection();
        const commandPath = path_1.default.join(__dirname, 'commands');
        console.log(commandPath);
        console.log((0, fs_1.readdirSync)(commandPath));
    }
}
exports.default = ExtendedClient;
