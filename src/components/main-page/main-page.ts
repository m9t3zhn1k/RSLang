import { BaseComponent } from '../base-component/base-component';
import './main-page.scss';

export class MainPage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page red');
    this.element.textContent = 'I am the main page';
  }
}
