import { BASE_URL } from '../constants/constants';
import { IWord } from '../types/types';

export const getWords = async (): Promise<IWord[]> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/words?page=2&group=0`);
  const content: Promise<IWord[]> = await rawResponse.json();
  return content;
};
