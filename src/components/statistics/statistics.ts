
import { BaseComponent } from '../base-component/base-component';
import './statistics.scss';

export class Statistics extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', ['page', 'orange']);
    this.element.textContent = 'I am the statistics';
  }
}
