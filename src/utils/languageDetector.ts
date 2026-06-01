/** ISO-639-3 (and common ISO-639-1 aliases from model output). */
export const isEnglishLanguageCode = (code: string): boolean =>
  code === 'eng' || code === 'en'

const ENGLISH_WORDS = new Set([
  'a', 'about', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'back', 'be', 'been', 'before', 'being', 'but', 'by', 'can', 'come',
  'could', 'did', 'do', 'does', 'doing', 'don', 'down', 'each', 'even', 'every',
  'few', 'for', 'from', 'get', 'go', 'going', 'got', 'had', 'has', 'have', 'he',
  'her', 'here', 'him', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
  'just', 'know', 'like', 'little', 'look', 'made', 'make', 'many', 'may', 'me',
  'more', 'most', 'much', 'must', 'my', 'need', 'never', 'no', 'not', 'now', 'of',
  'off', 'on', 'one', 'only', 'or', 'other', 'our', 'out', 'over', 'own', 'people',
  'please', 'proof', 'put', 'really', 'said', 'say', 'says', 'see', 'she', 'should',
  'so', 'some', 'still', 'such', 'take', 'than', 'that', 'the', 'their', 'them',
  'then', 'there', 'these', 'they', 'think', 'this', 'those', 'through', 'time',
  'to', 'too', 'translated', 'translation', 'translate', 'translating', 'two', 'up',
  'us', 'very', 'want', 'was', 'we', 'well', 'were', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'with', 'would', 'yes', 'you', 'your',
])

const tokenizeWords = (text: string): string[] =>
  text.toLowerCase().match(/\b[\p{L}']+\b/gu) ?? []

/**
 * True when most tokens are common English words (Twitch often mixes in
 * foreign names or one borrowed word, e.g. "also prova is not proof").
 */
export const isPredominantlyEnglish = (text: string): boolean => {
  const words = tokenizeWords(text)
  if (words.length === 0) return false

  const englishCount = words.filter((w) => ENGLISH_WORDS.has(w)).length
  if (englishCount === 0) return false
  if (words.length === 1) return true

  return englishCount / words.length >= 0.5
}
