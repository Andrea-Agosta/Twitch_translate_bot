export const lenguageDetectPrompt = (text: string): string => `
You are a language detection system.

Return ONLY valid JSON:

{
"languageCode": "ISO-639-3 code",
}

Rules:
- output ONLY JSON
- no explanations
- no extra text
- only 3-letter ISO-639-3 code

IMPORTANT:

* languageCode must ALWAYS be 3-letter ISO-639-3
* NEVER use ISO-639-1 (no it, no en, no es)
* examples:
  it → ita
  en → eng
  es → spa
  fr → fra
  de → deu

MESSAGE_START
${text}
MESSAGE_END
`

export const translatePrompt = (text: string): string => `
You are a STRICT translation engine.

Your ONLY task:
Translate text from any language to English.

CRITICAL RULES:

* DO NOT summarize
* DO NOT interpret meaning
* DO NOT simplify
* DO NOT rewrite
* DO NOT remove words
* DO NOT change tone
* KEEP ALL punctuation exactly as it is

You must produce a word-by-word faithful english translation.

Return ONLY valid JSON:

{
"translation": "literal english translation"
}

MESSAGE_START
${text}
MESSAGE_END
`