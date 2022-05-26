import { Command } from '.';

const Shuffle: Command = {
  name: 'shuffle',
  description: 'Shuffles the queue.',
  aliases: ['sh'],
  async execute(session) {
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
  },
};

export default Shuffle;
