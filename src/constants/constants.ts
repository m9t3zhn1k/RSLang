import { IPlayList, ILanguageLevels } from '../types/types';

export const DEFAULT_PAGE: string = 'main';

export const BASE_URL: string = 'https://app-rslang-exsample.herokuapp.com';

export const MAX_COUNT_OF_SYMBOLS: number = 8;

export const MAX_COUNT_OF_SECTIONS_FOR_AUTHORIZED: number = 7;

export const MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED: number = 6;

export const MAX_COUNT_OF_PAGES: number = 30;

export const START_PAGINATION_PAGE: number = 1;

export const SPRINT_DURATION: number = 30;

export const SECTIONS_COLORS: {
  '0': string;
  '1': string;
  '2': string;
  '3': string;
  '4': string;
  '5': string;
  '6': string;
} = {
  '0': '#f2150a',
  '1': '#f2e30a',
  '2': '#63f20a',
  '3': '#0ad3f2',
  '4': '#9d0af2',
  '5': '#f20acb',
  '6': '#190af2',
};

export const PLAYLIST: IPlayList[] = [
  {
    title: 'right-answer',
    src: '../assets/sounds/right_answer.mp3',
  },
  {
    title: 'wrong-answer',
    src: '../assets/sounds/wrong_answer.mp3',
  },
];

export const LANGUAGE_LEVELS: ILanguageLevels = {
  A1: 0,
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
  C2: 5,
};

export const COUNT_WORDS = 5;

export const COUNT_OF_WORDS_ON_PAGE = 20;

export const TIME_TOKEN = 15552000;
