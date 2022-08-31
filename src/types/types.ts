import { AudioChallengePage } from '../components/audiochallenge-page/audiochallenge-page';
import Ebook from '../components/ebook/ebook';
import { Games } from '../components/games/games';
import { MainPage } from '../components/main-page/main-page';
import Pagination from '../components/pagination/pagination';
import { SprintPage } from '../components/sprint-page/sprint-page';
import { Statistics } from '../components/statistics/statistics';

export interface IBaseComponent {
  element: HTMLElement;
  remove(): void;
}

export interface IConstants {
  DEFAULT_PAGE: 'main';
}

export interface IHeader {
  element: HTMLElement;
  navigation: INavigation;
  authorizationButton: HTMLButtonElement;
  wave: HTMLElement;
}

export interface INavigation {
  navigationButtons: HTMLElement[];
}

export interface IRouter {
  getPage(pageID?: string): PageType;
  updatePage(pageID: string): void;
  navigateApp(buttons: HTMLElement[]): void;
}

export interface IMain {
  currentPageID: string;
}

export type Advantage = {
  imageSource: string;
  imageAlt: string;
  title: string;
  description: string;
  id: string;
};

export type Developer = {
  imageSource: string;
  name: string;
  title: string;
  description: string;
  github: string;
  className: string;
};

export type DeveloperGitHub = {
  login: string;
  link: string;
};

export type PageType =
  | typeof Ebook
  | typeof Games
  | typeof MainPage
  | typeof Statistics
  | typeof SprintPage
  | typeof AudioChallengePage;

export interface IUser {
  email: string;
  password: string;
  name?: string;
}

export interface ILoginUser {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
}

export interface IGetUserWord {
  userId: string;
  wordId: string;
  token: string;
}

export interface ICreateUserWord {
  userId: string;
  wordId: string;
  token: string;
}

export interface IWord {
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  id: string;
  image: string;
  page: number;
  textExample: string;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
  userWord?: { difficulty: string; optional: { isDif: boolean; isLearned: boolean } };
}

export interface IResponseWord {
  audio: string;
  audioExample: string;
  audioMeaning: string;
  group: number;
  _id: string;
  image: string;
  page: number;
  textExampleTranslate: string;
  textMeaning: string;
  textMeaningTranslate: string;
  transcription: string;
  word: string;
  wordTranslate: string;
  textExample: string;
}
  
export interface ILanguageLevels {
  A1: number;
  A2: number;
  B1: number;
  B2: number;
  C1: number;
  C2: number;
}

export type IAggregatedResponse = { paginatedResults: IResponseWord[]; totalCount: [{ count: number }] };

export interface IUserWord {
  id: string;
  optional: {
    isDif: boolean;
    isLearned: boolean;
    correctAnswers?: number;
    incorrectAnswers?: number;
    seriesOfCorrectAnswers?: number;
  };
  wordId: string;
}

export interface IQueryParam {
  key: string;
  value: string;
}

export type RequestBody = {
  optional: {
    isDif: boolean;
    isLearned: boolean;
    correctAnswers?: number;
    incorrectAnswers?: number;
    seriesOfCorrectAnswers?: number;
  };
};

export type Optional = {
  isDif: boolean;
  isLearned: boolean;
  correctAnswers?: number;
  incorrectAnswers?: number;
  seriesOfCorrectAnswers?: number;
};

export interface IEbook {
  pagePagination: Pagination;
  numOfLearnedOrDifCards: number;
  audioFlag: boolean;
  drawCards: () => Promise<void>;
  addLearnedStyleToPage: () => void;
}

export interface IPagination {
  label: HTMLElement;
  currentPageNum: number;
}

export interface IWordCards {
  addToDifButton: HTMLElement;
  addtoLearnedButton: HTMLElement;
}

export interface IBaseComponentInnerHTML {
  element: HTMLElement;
  remove: () => void;
}

export interface IPlayList {
  title: string;
  src: string;
}

export type IGetAllUsersWords = () => Promise<IUserWord[] | null | void>;

export type WordResult = { word: IWord; result: boolean };
