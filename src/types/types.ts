import { AudiochallengePage } from '../components/audiochallenge-page/audiochallenge-page';
import { Ebook } from '../components/ebook/ebook';
import { Games } from '../components/games/games';
import { MainPage } from '../components/main-page/main-page';
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
  | typeof AudiochallengePage;
