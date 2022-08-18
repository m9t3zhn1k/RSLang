import { BaseComponent } from '../../components/base-component/base-component';
import './audiochallenge-page.scss';

export class AudiochallengePage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page brown');
    this.element.innerHTML = 'I am the Audiochallenge';
  }
}
