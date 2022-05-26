import { Command } from '.';

const Stop: Command = {
  name: 'stop',
  description: 'Stops the current song and clears the queue.',
  aliases: ['st'],
  async execute(session) {
    const { textChannel, queue } = session;

    if (!queue) {
      textChannel.send('There are no tracks in the queue.');
      return;
    }

    textChannel.send(`Stopping.`);

    session.clearQueueAndStopAudioPlayer();
  },
};

export default Stop;
