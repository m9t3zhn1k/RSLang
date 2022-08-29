import { IConstants, ILanguageLevels } from '../types/types';

export const constants: IConstants = {
  DEFAULT_PAGE: 'main',
};

export const BASE_URL: string = 'http://localhost:8020';

export const MAX_COUNT_OF_SYMBOLS: number = 8;

export const MAX_COUNT_OF_SECTIONS_FOR_AUTHORIZED = 7;

export const MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED = 6;

export const MAX_COUNT_OF_PAGES = 30;

export const START_PAGINATION_PAGE = 1;

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


export const LANGUAGE_LEVELS: ILanguageLevels = {
  A1: 0,
  A2: 1,
  B1: 2,
  B2: 3,
  C1: 4,
  C2: 5,
};
