import { AudiochallengePage } from '../components/audiochallenge-page/audiochallenge-page';
import Ebook from '../components/ebook/ebook';
import { Games } from '../components/games/games';
import { MainPage } from '../components/main-page/main-page';
import { SprintPage } from '../components/sprint-page/sprint-page';
import { Statistics } from '../components/statistics/statistics';
import { IBaseComponent, IHeader, IRouter, PageType } from '../types/types';

export class Router implements IRouter {
  private currentPage: IBaseComponent;

  private mainPage: string = 'main';

  private ebook: string = 'ebook';

  private games: string = 'games';

  private statistics: string = 'statistics';

  private sprintPage: string = 'sprint';

  private audioChallengePage: string = 'audiochallenge';

  constructor(
    private parent: HTMLElement,
    navigationButtons: HTMLElement[],
    private header: IHeader,
    pageID?: string
  ) {
    this.currentPage = new (this.getPage(pageID))(this.parent, this);
    this.navigateApp(navigationButtons);
  }

  public getPage(pageID?: string): PageType {
    switch (pageID) {
      case this.ebook:
        return Ebook;
      case this.games:
        return Games;
      case this.statistics:
        return Statistics;
      case this.sprintPage:
        return SprintPage;
      case this.audioChallengePage:
        return AudiochallengePage;
      case this.mainPage:
      default:
        this.header.wave.classList.add('hidden');
        return MainPage;
    }
  }

  public updatePage(pageID: string): void {
    const newSection: PageType = this.getPage(pageID);
    if (this.currentPage instanceof newSection) {
      return;
    }
    this.currentPage.remove();
    this.currentPage = new newSection(this.parent, this);
    if (this.currentPage instanceof MainPage) {
      this.header.wave.classList.add('hidden');
      this.header.element.classList.remove('hidden');
    } else {
      this.header.wave.classList.remove('hidden');
      this.header.element.classList.add('hidden');
    }
  }

  public navigateApp(buttons: HTMLElement[]): void {
    buttons.forEach((button: HTMLElement): void => {
      button.addEventListener('click', (): void => {
        this.updatePage(button.id);
      });
    });
  }
}
