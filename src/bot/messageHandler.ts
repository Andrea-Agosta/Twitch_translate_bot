import tmi from 'tmi.js';
import { isEnglish } from '../utils/languageDetector';
import { translateText } from '../services/ollamaService';
import { shouldIgnoreMessage } from './filters/messageFilters';

export const createMessageHandler = (botUsername: string, client: tmi.Client) => {

  return async (
    channel: string,
    tags: tmi.ChatUserstate,
    message: string,
    self: boolean
  ) => {

    if (self) return;

    if (shouldIgnoreMessage(message, tags, botUsername)) return;

    if (isEnglish(message)) return;

    try {

      const translation = await translateText(message);

      client.say(
        channel,
        `@${tags.username} ${translation}`
      );

    } catch (err) {
      console.error('Translation error:', err);
    }

  };
}