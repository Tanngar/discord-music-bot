"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Help = {
    name: 'help',
    description: 'Bruh...',
    aliases: ['h'],
    execute(session, client) {
        if (!client)
            return;
        const { commands } = client;
        const commandsInfo = [];
        commands.forEach((command) => {
            const name = `Command:      **-${command.name}**\n`;
            const aliases = `Aliases:           **${command.aliases.map((alias) => ` -${alias}`)}**\n`;
            const description = `Description:    **${command.description}**\n\n`;
            commandsInfo.push(name, aliases, description);
        });
        const { textChannel } = session;
        textChannel.send(commandsInfo.join(''));
    },
};
exports.default = Help;
