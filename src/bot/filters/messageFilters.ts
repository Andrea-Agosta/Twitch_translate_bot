import tmi from 'tmi.js';

export const shouldIgnoreMessage = (
  message: string,
  tags: tmi.ChatUserstate,
  botUsername: string
): boolean => {

  if (!tags.username) return true;

  if (tags.username === botUsername) return true;

  if (message.startsWith('!')) return true;

  if (message.length < 4) return true;

  return false;
}