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
You are a translation bot that preserves SPECIAL TOKENS.
The user message contains tokens like TOKEN_0, TOKEN_1, etc. 

RULES:
1. Translate the message into English.
2. NEVER remove, skip, or modify the tokens (TOKEN_0, TOKEN_1, etc.).
3. Treat tokens as nouns and place them in the correct grammatical position in the English sentence.
4. Output ONLY JSON.

EXAMPLE:
Input: "Ciao TOKEN_0, come va? 🍎" (where 🍎 became TOKEN_1)
Output: {"translation": "Hello TOKEN_0, how is it going? TOKEN_1"}

MESSAGE TO TRANSLATE:
${text}
`
