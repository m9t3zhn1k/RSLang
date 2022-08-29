import { BASE_URL } from '../constants/constants';
import { IWord } from '../types/types';

export const getWords = async (page: number, group: number): Promise<IWord[]> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/words?page=${page}&group=${group}`);
  const content: Promise<IWord[]> = await rawResponse.json();
  return content;
};
