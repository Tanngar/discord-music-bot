import ExtendedClient from '../client';
import Session from '../client/session';

export type Execute = (
  session: Session,
  client?: ExtendedClient,
  args?: string[]
) => void;

export type Command = {
  name: string;
  description: string;
  aliases: string[];
  execute: Execute;
};
