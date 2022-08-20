import { BaseComponent } from '../../components/base-component/base-component';
import { Constants } from '../../constants/constants';
import { Router } from '../../router/router';
import { IBaseComponent } from '../../types/types';
import './main.scss';

export class Main extends BaseComponent implements IBaseComponent {
  public currentPageID: string = Constants.DEFAULT_PAGE;

  constructor(parent: HTMLElement, navigationButtons: NodeListOf<ChildNode>) {
    super(parent, 'main', ['main']);
    new Router(this.element, navigationButtons, this.currentPageID);
  }
}
