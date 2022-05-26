import { Command } from '.';
import { escapeMarkdown } from '../utils';

const Queue: Command = {
  name: 'queue',
  description: 'Displays the queue.',
  aliases: ['q'],
  async execute(session) {
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
      const line = `**${i + 1}. ${escapeMarkdown(queue[i].title)} [${
        queue[i].length
      }]**\n`;

      if (contentLength + line.length < charLimit) {
        content += line;
      } else {
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
  },
};

export default Queue;
