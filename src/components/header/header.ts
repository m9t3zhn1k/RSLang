import { BaseComponent } from '../../components/base-component/base-component';
import { IBaseComponent } from '../../types/types';
import { Navigation } from '../navigation/navigation';
import './header.scss';

export class Header extends BaseComponent implements IBaseComponent {
  public readonly navigation: Navigation;

  constructor(parent: HTMLElement) {
    super(parent, 'header', 'header');
    this.navigation = new Navigation(this.element);
  }
}
