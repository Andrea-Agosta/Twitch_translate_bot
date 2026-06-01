import tmi from 'tmi.js'
import { isEnglishLanguageCode, isPredominantlyEnglish } from '../utils/languageDetector'
import { hasTranslatableText, stripEmoteTokens } from '../utils/emoteTokens'
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
    if (!hasTranslatableText(processedMessage)) return

    try {
      const textForDetection = stripEmoteTokens(processedMessage)
      if (isPredominantlyEnglish(textForDetection)) return

      const detectResponse = await translateText(lenguageDetectPrompt(textForDetection))
      const detected = JSON.parse(detectResponse)
      if (isEnglishLanguageCode(detected.languageCode)) return

      const translationResponse = await translateText(translatePrompt(processedMessage))
      const messageInfo = JSON.parse(translationResponse)
      const finalTranslation = restoreEmotes(messageInfo.translation, emoteMap)
      const languageInfo = getLanguageInfo(detected.languageCode)

      if (languageInfo.name !== "English") {
        client.say(
          channel,
          `ImTyping @${tags.username} said in ${languageInfo.name} ${languageInfo.flag} [ ${finalTranslation} ]`
        )
      }

    } catch (err) {
      console.error('Translation error:', err)
    }
  }
}
