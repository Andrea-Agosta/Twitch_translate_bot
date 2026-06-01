const EMOTE_TOKEN_PATTERN = /\bTOKEN_\d+\b/g

export const stripEmoteTokens = (message: string): string =>
  message.replace(EMOTE_TOKEN_PATTERN, ' ').replace(/\s+/g, ' ').trim()

export const hasTranslatableText = (message: string): boolean => {
  const text = stripEmoteTokens(message)
  if (!text) return false
  return /\p{L}/u.test(text)
}
