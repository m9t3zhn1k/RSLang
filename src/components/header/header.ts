import { BaseComponent } from '../../components/base-component/base-component';
import { IBaseComponent } from '../../types/types';
import Authorization from '../authorization/authorization';
import { Navigation } from '../navigation/navigation';
import './header.scss';

export class Header extends BaseComponent implements IBaseComponent {
  public readonly navigation: Navigation;

  public buttonSingIn: BaseComponent;

  private authorization: Authorization | undefined;

  constructor(parent: HTMLElement) {
    super(parent, 'header', ['header']);
    this.navigation = new Navigation(this.element);

    this.buttonSingIn = new BaseComponent(this.element, 'button', ['header__login'], 'Войти');
    this.buttonSingIn.element.addEventListener('click', (): void => {
      switch (this.buttonSingIn.element.textContent) {
        case 'Войти':
          this.authorization = new Authorization(document.body, this.changeContentForButtonLogin.bind(this));
          break;
        case 'Выйти':
          this.authorization?.signOut();
          this.changeContentForButtonLogin('Войти');
          break;
      }
    });
  }

  changeContentForButtonLogin(content: string): void {
    this.buttonSingIn.element.textContent = content;
  }
}
