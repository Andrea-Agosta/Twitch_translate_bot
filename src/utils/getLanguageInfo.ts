import languages from '../data/languages.json';

type LangInfo = {
  name: string;
  flag: string;
};

export const getLanguageInfo = (code: string): LangInfo => {
  return (languages as any)[code] ?? {
    name: 'Unknown',
    flag: '🌐'
  };
}