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

export interface IRefreshToken {
  refreshToken: string;
  token: string;
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
  userWord?: { difficulty: string; optional: Optional };
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
  optional: Optional;
  wordId: string;
}

export interface IQueryParam {
  key: string;
  value: string;
}

export type RequestBody = {
  optional: Optional;
};

export type Optional = {
  isDif: boolean;
  isLearned: boolean;
  correctAnswers?: number;
  incorrectAnswers?: number;
  seriesOfCorrectAnswers?: number;
  initDate?: string;
  learntDate?: string;
};

export interface IEbook {
  pagePagination: Pagination;
  numOfLearnedOrDifCards: number;
  audioFlag: boolean;
  updateCards: () => void;
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

export interface IStatistics {
  optional: {
    date: string;
    newWords: string;
    sprint: IGameStatistics;
    audioChallenge: IGameStatistics;
  };
}

export interface IGameStatistics {
  answers: number;
  newWords: string;
  correctAnswers: number;
  longestCorrectSeries: number;
}

export type StatisticsData = [statistics: IStatistics | void, userWords: IUserWord[] | null | void];

export type IGetAllUsersWords = () => Promise<IUserWord[] | null | void>;

export type WordResult = { word: IWord; result: boolean };

export type WordResultSynch = { word: IUserWord; result: boolean };

export type ShortTermStatisticsElements = {
  newAllWordsCounter: HTMLElement;
  learntAllWordsCounter: HTMLElement;
  rightAnswersAllCounter: HTMLElement;
  newAudioChallengeWordsCounter: HTMLElement;
  rightAnswersAudioChallengeCounter: HTMLElement;
  longestSeriesAudioChallengeCounter: HTMLElement;
  newSprintWordsCounter: HTMLElement;
  rightAnswersSprintCounter: HTMLElement;
  longestSeriesSprintCounter: HTMLElement;
};
