import { BaseComponent } from '../base-component/base-component';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page yellowgreen');
    this.element.textContent = 'I am the Sprint';
  }
}
