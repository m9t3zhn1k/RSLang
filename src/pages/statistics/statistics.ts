import { BaseComponent } from '../../components/base-component/base-component';
import './statistics.scss';

export class Statistics extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page orange');
    this.element.innerHTML = 'I am the statistics';
  }
}
