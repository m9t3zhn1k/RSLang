import { BaseComponent } from '../../components/base-component/base-component';
import { Router } from '../../router/router';
import { IBaseComponent } from '../../types/types';
import './ebook.scss';

export class Ebook extends BaseComponent {
  constructor(parent: HTMLElement, router: Router) {
    super(parent, 'section', 'page green flex');
    this.element.innerHTML = 'I am the ebook';
    const firstGameButton: IBaseComponent = new BaseComponent(this.element, 'button', 'game-button');
    const secondGameButton: IBaseComponent = new BaseComponent(this.element, 'button', 'game-button');
    firstGameButton.element.textContent = 'AudioChallenge';
    secondGameButton.element.textContent = 'Sprint';
    firstGameButton.element.id = 'audiochallenge';
    secondGameButton.element.id = 'sprint';
    router.navigateApp(this.element.childNodes);
  }
}
