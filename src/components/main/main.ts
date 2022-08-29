import { BaseComponent } from '../../components/base-component/base-component';
import { constants } from '../../constants/constants';
import { Router } from '../../router/router';
import { IHeader } from '../../types/types';
<<<<<<< HEAD
import { getLastPageFromLocalStorage } from '../../utils/storage/storage';

export class Main extends BaseComponent {
  public currentPageID: string = getLastPageFromLocalStorage() ?? constants.DEFAULT_PAGE;
=======

export class Main extends BaseComponent {
  public currentPageID: string = constants.DEFAULT_PAGE;
>>>>>>> 501d168 (refactor: update contents of the branch from develop)

  constructor(parent: HTMLElement, navigationButtons: HTMLElement[], header: IHeader) {
    super(parent, 'main', ['main']);
    new Router(this.element, navigationButtons, header, this.currentPageID);
  }
}
