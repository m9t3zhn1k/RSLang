import { BaseComponent } from '../../components/base-component/base-component';
import { constants } from '../../constants/constants';
import { Router } from '../../router/router';
import { IHeader } from '../../types/types';
import { getLastPageFromLocalStorage } from '../../utils/storage/storage';
import { Footer } from '../footer/footer';

export class Main extends BaseComponent {
  public currentPageID: string = getLastPageFromLocalStorage() ?? constants.DEFAULT_PAGE;

  constructor(parent: HTMLElement, navigationButtons: HTMLElement[], header: IHeader, footer: Footer) {
    super(parent, 'main', ['main']);
    new Router(this.element, navigationButtons, header, footer, this.currentPageID);
  }
}
