import { BaseComponent } from '../base-component/base-component';
import { Router } from '../../router/router';
import './ebook.scss';

export class Ebook extends BaseComponent {
  constructor(parent: HTMLElement, router: Router) {
    super(parent, 'div', ['wrapper']);
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container']).element;
    const firstGameButton: HTMLElement = new BaseComponent(container, 'button', ['game-button']).element;
    const secondGameButton: HTMLElement = new BaseComponent(container, 'button', ['game-button']).element;
    firstGameButton.textContent = 'AudioChallenge';
    secondGameButton.textContent = 'Sprint';
    firstGameButton.id = 'audiochallenge';
    secondGameButton.id = 'sprint';
    new BaseComponent(container, 'p', [], 'I am the eBook');
    router.navigateApp([firstGameButton, secondGameButton]);
  }
}
