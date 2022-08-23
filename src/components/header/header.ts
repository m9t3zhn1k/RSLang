import { BaseComponent } from '../../components/base-component/base-component';
import { IHeader, INavigation } from '../../types/types';
import { Navigation } from '../navigation/navigation';
import './header.scss';
import rslang_logo from '../../assets/icons/rslang_logo.svg';

export class Header extends BaseComponent implements IHeader {
  public readonly navigation: INavigation;

  public readonly authorizationButton: HTMLButtonElement;

  public wave: HTMLElement;

  constructor(parent: HTMLElement) {
    super(parent, 'header', ['header']);
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container', 'header__container']).element;
    const logoContainer: HTMLElement = new BaseComponent(container, 'div', ['header__block_logo', 'logo'], '', {
      id: 'main',
    }).element;
    const logo: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const controlsContainer: HTMLElement = new BaseComponent(container, 'div', ['header__block_controls']).element;
    const waveContainer: HTMLElement = new BaseComponent(this.element, 'div', ['wave', 'header__wave']).element;
    this.navigation = new Navigation(controlsContainer);
    this.authorizationButton = new BaseComponent(controlsContainer, 'button', ['button', 'header__button'], 'Войти')
      .element as HTMLButtonElement;
    this.wave = new BaseComponent(waveContainer, 'img', ['wave', 'header__wave'], '', {
      src: './assets/images/waves/header_wave.svg',
      alt: 'Footer wave',
    }).element;
    this.renderLogo(logo, logoContainer);
  }

  private renderLogo(element: SVGSVGElement, container: HTMLElement): void {
    const useElem: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    element.setAttributeNS(null, 'class', 'logo__image');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${rslang_logo}#rslang_logo`);
    element.appendChild(useElem);
    this.navigation.navigationButtons.push(container);
    container.appendChild(element);
  }
}
