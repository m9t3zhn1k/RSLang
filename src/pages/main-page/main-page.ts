import { BaseComponent } from '../../components/base-component/base-component';
import './main-page.scss';

export class MainPage extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'section', 'page red');
    this.element.innerHTML = 'I am the main page';
  }
}
