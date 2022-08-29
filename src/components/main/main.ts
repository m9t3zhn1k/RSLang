import { BaseComponent } from '../../components/base-component/base-component';
import { DEFAULT_PAGE } from '../../constants/constants';
import { Router } from '../../router/router';
import { IHeader, IMain } from '../../types/types';
import { getLastPageFromLocalStorage } from '../../utils/storage/storage';
import { Footer } from '../footer/footer';

export class Main extends BaseComponent implements IMain {
  public currentPageID: string = getLastPageFromLocalStorage() ?? DEFAULT_PAGE;

  constructor(parent: HTMLElement, navigationButtons: HTMLElement[], header: IHeader, footer: Footer) {
    super(parent, 'main', ['main']);
    new Router(this.element, navigationButtons, header, footer, this.currentPageID);
  }
}
