import { AboutTeam } from '../pages/about-team/about-team';
import { Ebook } from '../pages/ebook/ebook';
import { Games } from '../pages/games/games';
import { MainPage } from '../pages/main-page/main-page';
import { Statistics } from '../pages/statistics/statistics';

export interface IBaseComponent {
  element: HTMLElement;
  remove(): void;
}

export interface IConstants {
  DEFAULT_PAGE: 'main';
}

export type TypeOfPage = typeof AboutTeam | typeof Ebook | typeof Games | typeof MainPage | typeof Statistics;
