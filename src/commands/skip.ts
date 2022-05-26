import { Command } from '.';

const Skip: Command = {
  name: 'skip',
  description: 'Skips the current track.',
  aliases: ['s', 'next', 'n'],
  async execute(session) {
    const { textChannel, queue, player } = session;

    if (!queue) {
      textChannel.send('There are no tracks in the queue.');
      return;
    }

    if (queue.length > 1) {
      textChannel.send('Skipping.');
      player.stop();
    } else if (queue.length === 1) {
      textChannel.send('Skipping. There are no more tracks in the queue.');
      player.stop();
    }
  },
};

export default Skip;
