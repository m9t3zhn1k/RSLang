import { Router } from '../../router/router';
import { getLastPageFromLocalStorage } from '../../utils/storage/storage';
import { BaseComponent } from '../base-component/base-component';
import { SprintGamePage } from './sprint-game-gaming';
import { SprintStartPage } from './sprint-game-start';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  private container: HTMLElement;

  private group: number = Number(localStorage.getItem('sectionNum') ?? 1) - 1;

  private page: number = Number(localStorage.getItem('pageNum') ?? 1) - 1;

  constructor(parent: HTMLElement, router: Router) {
    super(parent, 'div', ['wrapper', 'wrapper__sprint-game']);
    const previousPage: string | null = getLastPageFromLocalStorage();
    this.container = new BaseComponent(this.element, 'div', ['container', 'game__container']).element;
    if (previousPage === 'ebook') {
      new SprintGamePage(this.container, this.group, this.page, router);
    } else {
      new SprintStartPage(this.container, SprintGamePage, router);
    }
    this.renderLights();
  }

  private renderLights(): void {
    for (let i = 1; i <= 9; i++) {
      new BaseComponent(this.element, 'div', ['light', `x${i}`]);
    }
  }
}
