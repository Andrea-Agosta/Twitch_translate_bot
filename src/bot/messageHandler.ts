import tmi from 'tmi.js'
import { isEnglish } from '../utils/languageDetector'
import { translateText } from '../services/ollamaService'
import { shouldIgnoreMessage } from './filters/messageFilters'
import { getLanguageInfo } from '../utils/getLanguageInfo'
import { prepareMessageForTranslation } from '../utils/prepareMessageForTranslation'
import { translatePrompt, lenguageDetectPrompt } from '../prompts/translate.prompt'
import { restoreEmotes } from '../utils/restoreTwitchEmotes'

export const createMessageHandler = (_botUsername: string, client: tmi.Client) => {

  return async (
    channel: string,
    tags: tmi.ChatUserstate,
    message: string,
    self: boolean
  ) => {

    if (self) return

    const { processedMessage, emoteMap } = prepareMessageForTranslation(message, tags.emotes)
    if (shouldIgnoreMessage(tags, processedMessage)) return
    if (isEnglish(processedMessage)) return

    try {

      const translationResponse = await translateText(translatePrompt(processedMessage))
      const messageInfo = JSON.parse(translationResponse)
      const finalTranslation = restoreEmotes(messageInfo.translation, emoteMap)
      const code = await translateText(lenguageDetectPrompt(processedMessage))
      const info = JSON.parse(code)
      const languageInfo = getLanguageInfo(info.languageCode)

      client.say(
        channel,
        `ImTyping @${tags.username} said in ${languageInfo.name} ${languageInfo.flag} [ ${finalTranslation} ]`
      )

    } catch (err) {
      console.error('Translation error:', err)
    }
  }
}
