import { ignoredUsers } from '../config/ignoredUsers'
import { looksLikePromptInjection } from './promptInjection'
import tmi from 'tmi.js'

export const shouldIgnoreMessage = (
  tags: tmi.ChatUserstate,
  message: string
): boolean => {

  const username = tags.username?.toLowerCase()
  if (!username) return true

  if (ignoredUsers.includes(username)) return true

  if (message.startsWith('!')) return true

  if (message.length < 4) return true

  if (looksLikePromptInjection(message)) return true

  return false
}