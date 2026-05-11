import { ignoredUsers } from '../config/ignoredUsers';
import tmi from 'tmi.js';

export function shouldIgnoreMessage(
  tags: tmi.ChatUserstate,
  message: string
): boolean {

  const username = tags.username?.toLowerCase();
  if (!username) return true;

  if (ignoredUsers.includes(username)) return true;

  if (message.startsWith('!')) return true;

  if (message.length < 4) return true;

  return false;
}