import { BaseComponent } from '../base-component/base-component';
import imgBack from '../../assets/icons/back-btn.svg';
import './back-top.scss';

class ButtonBack {
  constructor() {
    const button: HTMLElement = new BaseComponent(document.body, 'div', ['button-back-top']).element;
    (new BaseComponent(button, 'img').element as HTMLImageElement).src = imgBack;

    window.addEventListener('scroll', (): void => {
      if (window.pageYOffset > document.body.clientHeight) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    button.addEventListener('click', (): void => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
}

export default ButtonBack;
