import { AboutTeam } from '../components/about-team/about-team';
import { Ebook } from '../components/ebook/ebook';
import { Games } from '../components/games/games';
import { MainPage } from '../components/main-page/main-page';
import { Statistics } from '../components/statistics/statistics';

export interface IBaseComponent {
  element: HTMLElement;
  remove(): void;
}

export interface IConstants {
  DEFAULT_PAGE: 'main';
}

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

export type PageType = typeof AboutTeam | typeof Ebook | typeof Games | typeof MainPage | typeof Statistics;
