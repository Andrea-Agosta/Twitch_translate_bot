import axios from 'axios'

export const translateText = async (prompt: string): Promise<string> => {
  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: 'llama3.2',
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