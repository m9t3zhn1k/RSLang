import { AboutTeam } from '../pages/about-team/about-team';
import { AudiochallengePage } from '../pages/audiochallenge-page/audiochallenge-page';
import { Ebook } from '../pages/ebook/ebook';
import { Games } from '../pages/games/games';
import { MainPage } from '../pages/main-page/main-page';
import { SprintPage } from '../pages/sprint-page/sprint-page';
import { Statistics } from '../pages/statistics/statistics';
import { IBaseComponent, TypeOfPage } from '../types/types';

export class Router {
  private currentPage: IBaseComponent;

  private mainPage: string = 'main';

  private ebook: string = 'ebook';

  private games: string = 'games';

  private statistics: string = 'statistics';

  private aboutTeam: string = 'about-team';

  private sprintPage: string = 'sprint';

  private audioChallengePage: string = 'audiochallenge';

  constructor(private parent: HTMLElement, navigationButtons: NodeListOf<ChildNode>, pageID?: string) {
    this.currentPage = new (this.getPage(pageID))(this.parent, this);
    this.navigateApp(navigationButtons);
  }

  public getPage(pageID?: string): TypeOfPage {
    switch (pageID) {
      case this.mainPage:
        return MainPage;
      case this.ebook:
        return Ebook;
      case this.games:
        return Games;
      case this.statistics:
        return Statistics;
      case this.aboutTeam:
        return AboutTeam;
      case this.sprintPage:
        return SprintPage;
      case this.audioChallengePage:
        return AudiochallengePage;
      default:
        return MainPage;
    }
  }

  public updatePage(pageID: string): void {
    const newSection: TypeOfPage = this.getPage(pageID);
    if (this.currentPage instanceof newSection) {
      return;
    }
    this.currentPage.remove();
    this.currentPage = new newSection(this.parent, this);
  }

  public navigateApp(buttons: NodeListOf<ChildNode>): void {
    buttons.forEach((button: ChildNode): void => {
      button.addEventListener('click', (): void => {
        this.updatePage((button as HTMLElement).id);
      });
    });
  }
}
