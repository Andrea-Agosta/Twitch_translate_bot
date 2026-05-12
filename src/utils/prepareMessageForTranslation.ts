import { KNOWN_EMOTES } from "../bot/config/ignoredEmotes"

export const prepareMessageForTranslation = (
  message: string,
  emotes?: Record<string, string[]>
): { processedMessage: string, emoteMap: string[] } => {
  const emoteMap: string[] = []
  let tempMessage = message

  // Twitch Emote Management (use a temporary placeholder)
  if (emotes) {
    const positionsToReplace: { start: number, end: number, content: string }[] = []
    Object.entries(emotes).forEach(([id, positions]) => {
      positions.forEach(pos => {
        const [start, end] = pos.split('-').map(Number)
        positionsToReplace.push({ start, end, content: message.substring(start, end + 1) })
      })
    })
    // sort from the end to not mess up the indexes during the replacement
    positionsToReplace.sort((a, b) => b.start - a.start).forEach(item => {
      const placeholder = `TOKEN_${emoteMap.length}`
      emoteMap.push(item.content)
      tempMessage = tempMessage.substring(0, item.start) + placeholder + tempMessage.substring(item.end + 1)
    })
  }

  // Managment Emoji and tird part (with Regex and Split)
  let words = tempMessage.split(/(\s+)/)
  words = words.map(word => {
    if (word.match(/\p{Emoji_Presentation}/gu) || word.match(/\p{Extended_Pictographic}/gu) || KNOWN_EMOTES.has(word.trim())) {
      const placeholder = `TOKEN_${emoteMap.length}`
      emoteMap.push(word.trim())
      return placeholder
    }
    return word
  })

  return {
    processedMessage: words.join('').replace(/\s\s+/g, ' ').trim(),
    emoteMap
  }
}
