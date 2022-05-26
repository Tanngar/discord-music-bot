export const MILLISECONDS_IN_SECOND = 1000;
export const SECONDS_IN_MINUTE = 60;
export const SECONDS_IN_HOUR = 3600;

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = array;
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// prettier-ignore
export const escapeMarkdown = (text: string): string => text.replace('**', '\\**');
