import { BaseComponent } from '../base-component/base-component';
import './statistics.scss';

export class Statistics extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper']);
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container']).element;
    new BaseComponent(container, 'p', [], 'I am the statistics');
  }
}
