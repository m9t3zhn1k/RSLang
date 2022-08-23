import { DeveloperGitHub } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './footer.scss';

const DEVELOPERS: DeveloperGitHub[] = [
  {
    login: 'anton13602',
    link: 'https://github.com/anton13602',
  },
  {
    login: 'maximomelchuk',
    link: 'https://github.com/maximomelchuk',
  },
  {
    login: 'm9t3zhn1k',
    link: 'https://github.com/m9t3zhn1k',
  },
];

export class Footer extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'footer', ['footer']);
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container', 'footer__container']).element;
    const waveContainer: HTMLElement = new BaseComponent(this.element, 'div', ['wave', 'footer__wave']).element;
    const schoolLogoContainer: HTMLElement = new BaseComponent(container, 'a', ['footer__rs-logo'], '', {
      href: 'https://rs.school/js/',
    }).element;
    const membersContainer: HTMLElement = new BaseComponent(container, 'ul', ['footer__members-list']).element;
    new BaseComponent(container, 'span', ['footer__year'], '2022');
    new BaseComponent(schoolLogoContainer, 'img', [], '', {
      src: './assets/icons/rs_school_js.svg',
      alt: 'RS School logo',
    });
    new BaseComponent(waveContainer, 'img', ['wave', 'footer__wave'], '', {
      src: './assets/images/waves/footer_wave.svg',
      alt: 'Footer wave',
    });
    DEVELOPERS.forEach((developer: DeveloperGitHub): void => this.renderMember(developer, membersContainer));
  }

  private renderMember(developer: DeveloperGitHub, container: HTMLElement): void {
    const { login, link } = developer;
    const itemElement: HTMLElement = new BaseComponent(container, 'li', ['footer__member']).element;
    new BaseComponent(itemElement, 'a', ['footer__member_link'], login, { href: link, target: '_blank' });
  }
}
