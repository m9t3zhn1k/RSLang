import { BaseComponent } from '../../components/base-component/base-component';
import { constants } from '../../constants/constants';
import { Router } from '../../router/router';

export class Main extends BaseComponent {
  public currentPageID: string = constants.DEFAULT_PAGE;

  constructor(parent: HTMLElement, navigationButtons: HTMLElement[], headerWave: HTMLElement) {
    super(parent, 'main', ['main']);
    new Router(this.element, navigationButtons, headerWave, this.currentPageID);
  }
}
