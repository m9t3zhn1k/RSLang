import { BaseComponent } from '../base-component/base-component';
import { SprintGamePage } from './sprint-game-gaming';
import { SprintStartPage } from './sprint-game-start';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  private container: HTMLElement;

  private group: number = 0;

  private page: number = 0;

  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper', 'wrapper__sprint-game']);
    const previousPage: string | null = localStorage.getItem('lastPage');
    this.container = new BaseComponent(this.element, 'div', ['container', 'game__container']).element;
    if (previousPage === 'ebook') {
      new SprintGamePage(this.container, this.group, this.page);
    } else {
      new SprintStartPage(this.container, SprintGamePage);
    }
    this.renderLights();
  }

  private renderLights(): void {
    for (let i = 1; i <= 9; i++) {
      new BaseComponent(this.element, 'div', ['light', `x${i}`]);
    }
  }
}
