import { BaseComponent } from '../base-component/base-component';
import './about.-team.scss';

export class AboutTeam extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page yellow');
    this.element.textContent = 'I am the page about team';
  }
}
