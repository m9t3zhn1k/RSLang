import { BaseComponent } from '../base-component/base-component';
import './audiochallenge-page.scss';

export class AudiochallengePage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page brown');
    this.element.textContent = 'I am the Audiochallenge';
  }
}
