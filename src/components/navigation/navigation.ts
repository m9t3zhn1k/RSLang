import { IBaseComponent } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './navigation.scss';

export class Navigation extends BaseComponent {
  private toMainPageButton: IBaseComponent;

  private toEbookButton: IBaseComponent;

  private toGamesButton: IBaseComponent;

  private toStatisticsButton: IBaseComponent;

  private toAboutTeamButton: IBaseComponent;

  public navigationButtons: NodeListOf<ChildNode>;

  constructor(parent: HTMLElement) {
    super(parent, 'nav', 'navigation');
    this.toMainPageButton = new BaseComponent(this.element, 'button');
    this.toEbookButton = new BaseComponent(this.element, 'button');
    this.toGamesButton = new BaseComponent(this.element, 'button');
    this.toStatisticsButton = new BaseComponent(this.element, 'button');
    this.toAboutTeamButton = new BaseComponent(this.element, 'button');
    this.toMainPageButton.element.id = 'main';
    this.toEbookButton.element.id = 'ebook';
    this.toGamesButton.element.id = 'games';
    this.toStatisticsButton.element.id = 'statistics';
    this.toAboutTeamButton.element.id = 'about-team';
    this.toMainPageButton.element.textContent = 'main';
    this.toEbookButton.element.textContent = 'ebook';
    this.toGamesButton.element.textContent = 'games';
    this.toStatisticsButton.element.textContent = 'statistics';
    this.toAboutTeamButton.element.textContent = 'about-team';
    this.navigationButtons = this.element.childNodes;
  }
}
