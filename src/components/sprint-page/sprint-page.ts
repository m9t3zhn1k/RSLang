import { BaseComponent } from '../base-component/base-component';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper']);
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container']).element;
    new BaseComponent(container, 'p', [], 'I am the Sprint');
  }
}
