import { KNOWN_EMOTES } from "../bot/config/ignoredEmotes"

export function removeTwitchEmotes(
  message: string,
  emotes?: Record<string, string[]>
): string {
  // removing twitch channels emotes
  const charArray = Array.from(message)

  if (emotes) {
    Object.entries(emotes).forEach(([id, positions]) => {
      positions.forEach((position) => {
        const [start, end] = position.split('-').map(Number)
        for (let i = start; i <= end; i++) {
          charArray[i] = ""
        }
      })
    })
  }

  let cleanedMessage = charArray.join('')

  // Remove emoji like 🤣😂❤️
  cleanedMessage = cleanedMessage.replace(/\p{Emoji_Presentation}/gu, '')
    .replace(/\p{Extended_Pictographic}/gu, '')

  // Remove BTTV / 7TV style emotes (word-based long tokens)
  cleanedMessage = cleanedMessage
    .split(/\s+/)
    .filter(token => !KNOWN_EMOTES.has(token))
    .join(' ')

  return cleanedMessage.replace(/\s\s+/g, ' ').trim()
}