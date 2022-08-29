import { BaseComponent } from '../base-component/base-component';
import './main-page.scss';
import advantages from './advantages.json';
import developers from './developers.json';
import github_logo from '../../assets/icons/github_logo.svg';
import { Advantage, Developer } from '../../types/types';
import { Router } from '../../router/router';

export class MainPage extends BaseComponent {
  private generalSection: HTMLElement;

  private advantagesSection: HTMLElement;

  private developersSection: HTMLElement;

  constructor(parent: HTMLElement, private router: Router) {
    super(parent, 'div', ['wrapper']);
    this.generalSection = new BaseComponent(this.element, 'section', ['main__general', 'general']).element;
    this.advantagesSection = new BaseComponent(this.element, 'section', ['main__advantages', 'advantages'], '', {
      id: 'advantages',
    }).element;
    this.developersSection = new BaseComponent(this.element, 'section', ['main__developers', 'developers']).element;
    this.renderGeneralSection();
    this.renderAdvantagesSection();
    this.renderDevelopersSection();
    this.renderLights();
  }

  private renderGeneralSection(): void {
    const container: HTMLElement = new BaseComponent(this.generalSection, 'div', ['container', 'general__container'])
      .element;
    const textContainer: HTMLElement = new BaseComponent(container, 'div', ['general__text-container']).element;
    const waveContainer: HTMLElement = new BaseComponent(this.generalSection, 'div', ['wave', 'general__wave']).element;
    new BaseComponent(textContainer, 'h1', ['general__title'], 'Самое время заняться английским c RSLang.');
    new BaseComponent(
      textContainer,
      'p',
      ['general__subtitle'],
      'Приложение подходит для эффективного изучения иностранных слов в игровой форме и отслеживания своего прогресса.'
    );
    new BaseComponent(textContainer, 'button', ['general__button'], 'Подробнее').element.addEventListener(
      'click',
      (e: MouseEvent): void => {
        e.preventDefault();
        document.getElementById('advantages')?.scrollIntoView();
      }
    );
    new BaseComponent(container, 'img', ['general__image'], '', {
      src: './assets/images/main/main.png',
      alt: 'General image',
    });
    new BaseComponent(waveContainer, 'img', [], '', {
      src: './assets/images/waves/general_wave.svg',
      alt: 'General image',
    });
  }

  private renderAdvantagesSection(): void {
    const topWaveContainer: HTMLElement = new BaseComponent(this.advantagesSection, 'div', ['wave', 'wave__top'])
      .element;
    new BaseComponent(this.advantagesSection, 'p', ['advantages__title'], 'Преимущества приложения').element;
    const container: HTMLElement = new BaseComponent(this.advantagesSection, 'div', [
      'container',
      'advantages__container',
    ]).element;
    const bottomWaveContainer: HTMLElement = new BaseComponent(this.advantagesSection, 'div', ['wave', 'wave__bottom'])
      .element;
    advantages.forEach((item: Advantage): void => this.renderAdvantageItem(container, item));
    new BaseComponent(topWaveContainer, 'img', [], '', {
      src: './assets/images/waves/section_top_wave.svg',
      alt: 'Top wave',
    });
    new BaseComponent(bottomWaveContainer, 'img', [], '', {
      src: './assets/images/waves/section_bottom_wave.svg',
      alt: 'Bottom wave',
    });
  }

  private renderDevelopersSection(): void {
    const container: HTMLElement = new BaseComponent(this.developersSection, 'div', [
      'container',
      'developers__container',
    ]).element;
    new BaseComponent(container, 'p', ['developers__title'], 'О разработчиках').element;
    developers.forEach((item: Developer): void => this.renderDeveloperItem(container, item));
  }

  private renderAdvantageItem(container: HTMLElement, advantage: Advantage): void {
    const { imageSource, imageAlt, title, description, id } = advantage;
    const itemContainer: HTMLElement = new BaseComponent(container, 'div', ['advantage', 'shadow'], '', { id: id })
      .element;
    new BaseComponent(itemContainer, 'img', ['advantage__image'], '', { src: imageSource, alt: imageAlt });
    const textContainer: HTMLElement = new BaseComponent(itemContainer, 'div', ['advantage__text']).element;
    new BaseComponent(textContainer, 'p', ['advantage__title'], title);
    new BaseComponent(textContainer, 'p', ['advantage__subtitle'], description);
    this.router.navigateApp([itemContainer]);
  }

  private renderDeveloperItem(container: HTMLElement, advantage: Developer): void {
    const { imageSource, name, title, description, github, className } = advantage;
    const itemContainer: HTMLElement = new BaseComponent(container, 'div', [
      'developers__item',
      'developer',
      'shadow',
      className,
    ]).element;
    const imageContainer: HTMLElement = new BaseComponent(itemContainer, 'div', ['developer__photo-container']).element;
    const textContainer: HTMLElement = new BaseComponent(itemContainer, 'div', ['developer__text-container']).element;
    new BaseComponent(imageContainer, 'img', ['developer__photo'], '', { src: imageSource, alt: name });
    new BaseComponent(textContainer, 'p', ['developer__name'], name);
    new BaseComponent(textContainer, 'p', ['developer__title'], title);
    new BaseComponent(textContainer, 'p', ['developer__description'], description);
    const githubContainer: HTMLElement = new BaseComponent(textContainer, 'a', ['developer__github'], '', {
      target: '_blank',
      href: github,
    }).element;
    const logo: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.renderLogo(logo, githubContainer);
  }

  private renderLogo(element: SVGSVGElement, container: HTMLElement): void {
    const useElem: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    element.setAttributeNS(null, 'class', 'developer__github_logo');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${github_logo}#logo`);
    element.appendChild(useElem);
    container.appendChild(element);
  }

  private renderLights(): void {
    new BaseComponent(this.element, 'div', ['light', 'x1']);
    new BaseComponent(this.element, 'div', ['light', 'x2']);
    new BaseComponent(this.element, 'div', ['light', 'x3']);
    new BaseComponent(this.element, 'div', ['light', 'x4']);
    new BaseComponent(this.element, 'div', ['light', 'x5']);
    new BaseComponent(this.element, 'div', ['light', 'x6']);
    new BaseComponent(this.element, 'div', ['light', 'x7']);
    new BaseComponent(this.element, 'div', ['light', 'x8']);
    new BaseComponent(this.element, 'div', ['light', 'x9']);
  }
}
