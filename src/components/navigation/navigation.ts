import { INavigation } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './navigation.scss';

export class Navigation extends BaseComponent implements INavigation {
  public navigationButtons: HTMLElement[];

  constructor(parent: HTMLElement) {
    super(parent, 'nav', ['header__nav', 'nav']);
    const navigationContainer: HTMLElement = new BaseComponent(this.element, 'ul', ['nav__list']).element;
    new BaseComponent(navigationContainer, 'li', ['nav__item'], 'Главная', { id: 'main' });
    new BaseComponent(navigationContainer, 'li', ['nav__item'], 'Учебник', { id: 'ebook' });
    new BaseComponent(navigationContainer, 'li', ['nav__item'], 'Игры', { id: 'games' });
    new BaseComponent(navigationContainer, 'li', ['nav__item'], 'Статистика', { id: 'statistics' });
    this.navigationButtons = [].slice.call(navigationContainer.childNodes);
  }
}
