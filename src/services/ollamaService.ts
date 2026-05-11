import axios from 'axios';
import { translatePrompt } from '../prompts/translate.prompt';

export const translateText = async (text: string): Promise<string> => {
  const response = await axios.post(
    'http://localhost:11434/api/generate',
    {
      model: 'llama3.2',
      prompt: translatePrompt(text),
      stream: false
    }
  );

  return response.data.response.trim();
}