import { franc } from 'franc'

export const detectLanguage = (text: string): string => {
  return franc(text)
}

export const isEnglish = (text: string): boolean => {
  const lang = detectLanguage(text)
  return lang === 'eng'
}