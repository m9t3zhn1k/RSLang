import { BaseComponent } from '../base-component/base-component';
import './authorization.scss';
import SingIn from './sing-in/sing-in';
import SingUp from './sing-up/sing-up';
import { MAX_COUNT_OF_SYMBOLS } from '../../constants/constants';

class Authorization extends BaseComponent {
  private wrapperAuthorization: BaseComponent;

  private login: SingIn;

  private singUp: SingUp;

  private wrapperForm: BaseComponent;

  private formSlider: BaseComponent;

  constructor(protected parentNode: HTMLElement, public contentForButton: (content: string) => void) {
    super(document.body, 'div', ['authorization']);
    this.wrapperAuthorization = new BaseComponent(this.element, 'div', ['authorization__wrapper']);
    const navigation: BaseComponent = new BaseComponent(this.wrapperAuthorization.element, 'div', [
      'nav-authorization',
    ]);
    this.wrapperForm = new BaseComponent(this.wrapperAuthorization.element, 'div', ['form__wrapper']);
    const buttonSingUp: BaseComponent = new BaseComponent(
      navigation.element,
      'button',
      ['nav-authorization__button', 'active-btn'],
      'Регистрация'
    );
    const buttonSingIn: BaseComponent = new BaseComponent(
      navigation.element,
      'button',
      ['nav-authorization__button'],
      'Вход'
    );

    this.formSlider = new BaseComponent(this.wrapperForm.element, 'div', ['form__slider']);
    setTimeout((): void => {
      this.element.classList.add('open-auth');
      this.wrapperAuthorization.element.classList.add('open-auth');
    }, 0);

    const cross: BaseComponent = new BaseComponent(navigation.element, 'div', ['nav-authorization__cross']);
    this.addEvent(buttonSingUp, buttonSingIn, cross);

    document.onkeyup = this.addKeyEventForm.bind(this);
    this.singUp = this.renderSingUp();
    this.login = this.renderSingIn();
  }

  private addEvent(buttonSingUp: BaseComponent, buttonSingIn: BaseComponent, cross: BaseComponent): void {
    buttonSingUp.element.addEventListener('click', (): void => {
      buttonSingUp.element.classList.add('active-btn');
      buttonSingIn.element.classList.remove('active-btn');
      this.formSlider.element.classList.remove('active-slider');
    });
    buttonSingIn.element.addEventListener('click', (): void => {
      buttonSingIn.element.classList.add('active-btn');
      buttonSingUp.element.classList.remove('active-btn');
      this.formSlider.element.classList.add('active-slider');
    });
    cross.element.addEventListener('click', (): void => {
      this.closeAuthorization();
    });
    this.element.addEventListener('click', (event: MouseEvent): void => {
      const { target } = event;
      if (!(target as HTMLElement)?.closest('.authorization__wrapper')) {
        this.closeAuthorization();
      }
    });
  }

  private renderSingIn(): SingIn {
    return new SingIn(
      this.formSlider.element,
      this.createItemForForm.bind(this),
      this.isValidateEmail.bind(this),
      this.isValidatePassword.bind(this),
      this.closeAuthorization.bind(this),
      this.contentForButton
    );
  }

  private renderSingUp(): SingUp {
    return new SingUp(
      this.formSlider.element,
      this.createItemForForm.bind(this),
      this.isValidateEmail.bind(this),
      this.isValidatePassword.bind(this),
      this.closeAuthorization.bind(this),
      this.contentForButton
    );
  }

  private closeAuthorization(): void {
    this.element.classList.remove('open-auth');
    this.wrapperAuthorization.element.classList.remove('open-auth');
    setTimeout(this.remove.bind(this), 150);
    document.onkeyup = null;
  }

  private createItemForForm(
    parentElement: HTMLElement,
    contentLabel: string,
    inputType: string,
    inputPlaceholder: string
  ): HTMLInputElement {
    const formItem: BaseComponent = new BaseComponent(parentElement, 'div', ['form__item']);
    new BaseComponent(formItem.element, 'label', ['form__label'], `${contentLabel}`);
    const inputNode: BaseComponent = new BaseComponent(formItem.element, 'input', ['form__input']);
    const inputElement = inputNode.element as HTMLInputElement;
    inputElement.type = `${inputType}`;
    switch (inputType) {
      case 'text':
        inputElement.setAttribute('name', 'name');
        inputElement.setAttribute('minlength', '3');
        break;
      case 'password':
        inputElement.setAttribute('minlength', `${MAX_COUNT_OF_SYMBOLS}`);
        break;
      default:
        inputElement.setAttribute('name', `${inputType}`);
        break;
    }
    inputElement.setAttribute('required', '');
    inputElement.placeholder = `${inputPlaceholder}`;

    return inputElement;
  }

  private isValidateEmail(inputEmail: HTMLInputElement): boolean {
    const emailRegExp: RegExp =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegExp.test(inputEmail.value.toLowerCase());
  }

  private isValidatePassword(inputPassword: HTMLInputElement): boolean {
    return inputPassword.value.length >= MAX_COUNT_OF_SYMBOLS;
  }

  private addKeyEventForm(e: KeyboardEvent): void {
    const flag: boolean = this.formSlider.element.classList.value.includes('active-slider');
    switch (e.key) {
      case 'Enter':
        flag ? this.login.handlerLoginForm(e) : this.singUp.handlerRegForm(e);
        break;
      case 'Escape':
        this.closeAuthorization();
        break;
    }
  }
}

export default Authorization;
