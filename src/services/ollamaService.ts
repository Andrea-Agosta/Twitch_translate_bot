import axios from 'axios'

const ollamaBaseUrl = (process.env.OLLAMA_URL ?? 'http://localhost:11434').replace(/\/$/, '')
const ollamaModel = process.env.OLLAMA_MODEL ?? 'llama3.2'

export const translateText = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    `${ollamaBaseUrl}/api/generate`,
    {
      model: ollamaModel,
      prompt: prompt,
      stream: false,
      format: 'json',
      options: {
        temperature: 0
      }
    }
  )

  return response.data.response.trim()
}