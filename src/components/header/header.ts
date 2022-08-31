import { BaseComponent } from '../../components/base-component/base-component';
import { IHeader, INavigation } from '../../types/types';
import { Navigation } from '../navigation/navigation';
import './header.scss';
import rslang_logo from '../../assets/icons/rslang_logo.svg';
import Authorization from '../authorization/authorization';

export class Header extends BaseComponent implements IHeader {
  public readonly navigation: INavigation;

  public readonly authorizationButton: HTMLButtonElement;

  public wave: HTMLElement;

  public authorization: Authorization | undefined;

  public storage: string | null;

  constructor(parent: HTMLElement) {
    super(parent, 'header', ['header']);
    this.storage = localStorage.getItem('rslang-team58-user');
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container', 'header__container']).element;
    const logoContainer: HTMLElement = new BaseComponent(container, 'div', ['header__block_logo', 'logo'], '', {
      id: 'main',
    }).element;
    const logo: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const controlsContainer: HTMLElement = new BaseComponent(container, 'div', ['header__block_controls']).element;
    const waveContainer: HTMLElement = new BaseComponent(this.element, 'div', ['wave', 'header__wave']).element;
    this.navigation = new Navigation(controlsContainer);
    this.authorizationButton = new BaseComponent(controlsContainer, 'button', ['header__button'])
      .element as HTMLButtonElement;
    this.authorizationButton.textContent = this.storage ? 'Выйти' : 'Войти';
    this.wave = new BaseComponent(waveContainer, 'img', ['wave', 'header__wave'], '', {
      src: './assets/images/waves/header_wave.svg',
      alt: 'Header wave',
    }).element;
    this.renderLogo(logo, logoContainer);
    this.addEventAuthBtn();
  }

  private renderLogo(element: SVGSVGElement, container: HTMLElement): void {
    const useElem: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    element.setAttributeNS(null, 'class', 'logo__image');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${rslang_logo}#rslang_logo`);
    element.appendChild(useElem);
    this.navigation.navigationButtons.push(container);
    container.appendChild(element);
  }

  private addEventAuthBtn(): void {
    this.authorizationButton.addEventListener('click', (): void => {
      switch (this.authorizationButton.textContent) {
        case 'Войти':
          this.authorization = new Authorization(document.body, this.changeContentForButtonLogin.bind(this));
          break;
        case 'Выйти':
          localStorage.removeItem('rslang-team58-user');
          this.changeContentForButtonLogin('Войти');
          break;
      }
    });
  }

  private changeContentForButtonLogin(content: string): void {
    this.authorizationButton.textContent = content;
  }
}
