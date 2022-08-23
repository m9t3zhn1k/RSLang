import { BaseComponent } from '../base-component/base-component';
import './authorization.scss';
import SingIn from './sing-in/sing-in';
import SingUp from './sing-up/sing-up';
import { MAX_COUNT_OF_SYMBOLS } from '../../constants/constants';

class Authorization extends BaseComponent {
  private wrapperAuthorization: BaseComponent;

  private login: SingIn | undefined;

  private singUp: SingUp | undefined;

  private wrapperForm: BaseComponent;

  constructor(protected parentNode: HTMLElement) {
    super(document.body, 'div', ['authorization']);
    this.wrapperAuthorization = new BaseComponent(this.element, 'div', ['authorization__wrapper']);
    const navigation = new BaseComponent(this.wrapperAuthorization.element, 'div', ['nav-authorization']);
    this.wrapperForm = new BaseComponent(this.wrapperAuthorization.element, 'div', ['form__wrapper']);
    const buttonSingUp: BaseComponent = new BaseComponent(
      navigation.element,
      'button',
      ['nav-authorization__button', 'active-btn'],
      'Регистрация'
    );
    const buttonSingIn = new BaseComponent(navigation.element, 'button', ['nav-authorization__button'], 'Вход');
    const cross = new BaseComponent(navigation.element, 'div', ['nav-authorization__cross']);
    this.addEvent(buttonSingUp, buttonSingIn, cross);

    this.renderSingUn();
  }

  addEvent(buttonSingUp: BaseComponent, buttonSingIn: BaseComponent, cross: BaseComponent): void {
    buttonSingUp.element.addEventListener('click', (): void => {
      buttonSingUp.element.classList.add('active-btn');
      buttonSingIn.element.classList.remove('active-btn');
      this.renderSingUn();
    });
    buttonSingIn.element.addEventListener('click', (): void => {
      buttonSingIn.element.classList.add('active-btn');
      buttonSingUp.element.classList.remove('active-btn');
      this.renderSingIn();
    });
    cross.element.addEventListener('click', (): void => {
      this.destroyAuthorization();
      this.element.classList.remove('active-authorization');
    });
    this.element.addEventListener('click', (event: MouseEvent): void => {
      const { target } = event;
      if (!(target as HTMLElement)?.closest('.authorization__wrapper')) {
        this.destroyAuthorization();
      }
    });
  }

  renderSingIn(): void {
    this.singUp?.destroySingUp();
    this.login?.destroySingIn();
    this.login = new SingIn(
      this.wrapperForm.element,
      this.createItemForForm.bind(this),
      this.isValidateEmail.bind(this),
      this.isValidatePassword.bind(this),
      this.destroyAuthorization.bind(this)
    );
  }

  renderSingUn(): void {
    this.login?.destroySingIn();
    this.singUp?.destroySingUp();
    this.singUp = new SingUp(
      this.wrapperForm.element,
      this.createItemForForm.bind(this),
      this.isValidateEmail.bind(this),
      this.isValidatePassword.bind(this),
      this.destroyAuthorization.bind(this)
    );
  }

  signOut(): void {
    localStorage.removeItem('rslang-team58-user');
  }

  createItemForForm(
    parentElement: HTMLElement,
    contentLabel: string,
    inputType: string,
    inputPlaceholder: string
  ): HTMLInputElement {
    const formItem = new BaseComponent(parentElement, 'div', ['form__item']);
    new BaseComponent(formItem.element, 'label', ['form__label'], `${contentLabel}`);
    const inputNode = new BaseComponent(formItem.element, 'input', ['form__input']);
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

  isValidateEmail(inputEmail: HTMLInputElement): boolean {
    const emailRegExp: RegExp =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    return emailRegExp.test(inputEmail.value.toLowerCase());
  }

  isValidatePassword(inputPassword: HTMLInputElement): boolean {
    return inputPassword.value.length >= MAX_COUNT_OF_SYMBOLS;
  }

  destroyAuthorization(): void {
    this.remove();
  }
}

export default Authorization;
