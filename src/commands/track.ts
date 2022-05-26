import { Command } from '.';

const Track: Command = {
  name: 'track',
  description: 'Displays URL for the current track.',
  aliases: ['t'],
  execute(session) {
    const { textChannel, queue } = session;

    const currentTrack = queue[0];

    textChannel.send(currentTrack.url);
  },
};

export default Track;
