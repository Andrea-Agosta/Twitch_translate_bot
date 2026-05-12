import tmi from 'tmi.js'
import { isEnglish } from '../utils/languageDetector'
import { translateText } from '../services/ollamaService'
import { shouldIgnoreMessage } from './filters/messageFilters'
import { getLanguageInfo } from '../utils/getLanguageInfo'
import { removeTwitchEmotes } from '../utils/removeTwitchEmotes'
import { translatePrompt, lenguageDetectPrompt } from '../prompts/translate.prompt'

export const createMessageHandler = (botUsername: string, client: tmi.Client) => {

  return async (
    channel: string,
    tags: tmi.ChatUserstate,
    message: string,
    self: boolean
  ) => {

    if (self) return

    const cleanedMessage = removeTwitchEmotes(
      message,
      tags.emotes
    )

    if (shouldIgnoreMessage(tags, cleanedMessage)) return

    if (isEnglish(cleanedMessage)) return

    try {
      const translation = await translateText(translatePrompt(cleanedMessage))
      const messageInfo = JSON.parse(translation)
      const code = await translateText(lenguageDetectPrompt(cleanedMessage))
      const info = JSON.parse(code)
      const languageInfo = getLanguageInfo(info.languageCode)

      client.say(
        channel,
        `ImTyping @${tags.username} said in ${languageInfo.name} ${languageInfo.flag} [${messageInfo.translation}]`
      )

    } catch (err) {
      console.error('Translation error:', err)
    }
  }
}
