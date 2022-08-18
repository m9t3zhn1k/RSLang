import { BaseComponent } from '../../components/base-component/base-component';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page yellowgreen');
    this.element.innerHTML = 'I am the Sprint';
  }
}
