/**
 * Blocks chat lines that resemble LLM jailbreak / instruction override tries.
 * Twitch chat skews casual; tuned to avoid banning normal banter while catching
 * well-known delimiter and “ignore previous…” patterns.
 */

const normalizeForScan = (text: string): string => {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u200b-\u200d\ufeff\u2060]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Same checks run on Unicode-normalized ASCII-ish text (NFKC lowercase). */
const PROMPT_OVERRIDE_SIGNALS: RegExp[] = [
  /```/,
  /<\|[^|]+\|>|\[\/?(?:system|inst)\]|im_(?:start|end)\b/,
  /message_(start|end)\b/,
  /\bmessage\s+to\s+translate\b/,
  /\{\s*["']?\s*translation\s*["']?\s*:/i,
  /\{\s*["']?\s*languagecode\s*["']?\s*:/i,
  /ignore\s+(all\s+)?(previous|prior|above)(\s+(instructions|rules|prompts))?/,
  /disregard\s+(the\s+)?(previous|prior|above)/,
  /override\s+(the\s+|your\s+|all\s+)?(instructions|rules|prompt)/,
  /\bnew\s+system\s+(prompt|message)\b/,
  /\b(do\s+anything\s+now|jailbreak)\b/,
  /(?:^|[\s.!?])\*{3,}\s*(system|assistant)\b/m,
  /(?:^|[\s.!?])#{3,}\s*(system|assistant)\b/m,
  /\byou\s+are\s+now\s+(a|an)\s+(assistant|translator|developer|helpful|unrestricted|evil)\b/,
  /reveal\s+(your|the)\s+(system\s+)?(prompt|instructions)/,
  /repeat\s+(your|the)[^!?.\n]{0,40}(instructions|prompt)/,
  /what\s+(is|are)\s+your[^!?.\n]{0,70}(instructions|prompt|system)/,
  // Common non-English phrasing on international streams.
  /\bignora\s+(?:tutte\s+)?(?:le\s+|las\s+|los\s+)?(?:istruzioni|instrucciones|instruções)\b/,
  /\bignorer\s+(?:les\s+)?(?:instructions|r[eèé]gles)\b/,
  /\boublie\b.{0,30}\b(?:instructions|r[eèé]gles)\b/,
]

export const looksLikePromptInjection = (raw: string): boolean => {
  if (!raw.trim()) return false

  const text = normalizeForScan(raw)

  for (const re of PROMPT_OVERRIDE_SIGNALS) {
    re.lastIndex = 0
    if (re.test(text)) return true
  }

  return false
}
