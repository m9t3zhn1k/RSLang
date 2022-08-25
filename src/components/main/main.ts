import { BaseComponent } from '../../components/base-component/base-component';
import { DEFAULT_PAGE } from '../../constants/constants';
import { Router } from '../../router/router';
import { IHeader } from '../../types/types';
import { Footer } from '../footer/footer';

export class Main extends BaseComponent {
  public currentPageID: string = DEFAULT_PAGE;

  constructor(parent: HTMLElement, navigationButtons: HTMLElement[], header: IHeader, footer: Footer) {
    super(parent, 'main', ['main']);
    new Router(this.element, navigationButtons, header, footer, this.currentPageID);
  }
}
