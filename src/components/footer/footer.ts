import { IBaseComponent } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './footer.scss';

export class Footer extends BaseComponent implements IBaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'footer', ['footer']);
    this.element.textContent = 'I am FOOOTER!!!!!!111';
  }
}
