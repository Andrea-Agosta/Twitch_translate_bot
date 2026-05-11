import tmi from 'tmi.js';
import { isEnglish } from '../utils/languageDetector';
import { translateText } from '../services/ollamaService';
import { shouldIgnoreMessage } from './filters/messageFilters';
import { getLanguageInfo } from '../utils/getLanguageInfo';
import { detectLanguage } from '../utils/languageDetector';

export const createMessageHandler = (botUsername: string, client: tmi.Client) => {

  return async (
    channel: string,
    tags: tmi.ChatUserstate,
    message: string,
    self: boolean
  ) => {

    if (self) return;

    if (shouldIgnoreMessage(tags, message)) return;

    if (isEnglish(message)) return;

    try {

      const translation = await translateText(message);
      const languageInfo = getLanguageInfo(detectLanguage(message))

      client.say(
        channel,
        `ImTyping @${tags.username} said in ${languageInfo.name} ${languageInfo.flag} [${translation}]`
      );

    } catch (err) {
      console.error('Translation error:', err);
    }

  };
}