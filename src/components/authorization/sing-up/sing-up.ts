import { BaseComponent } from '../../base-component/base-component';
import { createUser } from '../../../controller/user-controller';

class SingUp extends BaseComponent {
  private button: BaseComponent;

  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private inputLogin: HTMLInputElement;

  private form: BaseComponent;

  private confirmPassword: HTMLInputElement;

  private messageForPass: BaseComponent;

  constructor(
    protected parentNode: HTMLElement,
    public createItemForForm: (
      parentElement: HTMLElement,
      contentLabel: string,
      inputType: string,
      inputPlaceholder: string
    ) => HTMLInputElement,
    public isValidateEmail: (inputEmail: HTMLInputElement) => boolean,
    public isValidatePassword: (inputPassword: HTMLInputElement) => boolean,
    public destroyAuthorization: () => void
  ) {
    super(parentNode, 'div', ['sing-up__wrapper']);
    this.form = new BaseComponent(this.element, 'form', ['form__body']);

    this.inputLogin = createItemForForm(this.form.element, 'Имя пользователя', 'text', 'Введите имя');
    this.inputEmail = createItemForForm(this.form.element, 'Адрес электронной почты', 'email', 'Введите адрес почты');
    this.inputPassword = createItemForForm(this.form.element, 'Пароль', 'password', 'Введите пароль');
    this.confirmPassword = createItemForForm(this.form.element, 'Подтвердите пароль', 'password', 'Подтвердите пароль');

    this.messageForPass = new BaseComponent(
      this.confirmPassword.parentElement as HTMLElement,
      'p',
      ['form__message', 'message-active'],
      'Пароли, которые Вы ввели, не совпадают'
    );
    this.button = new BaseComponent(this.form.element, 'button', ['form__button'], 'Регистрация');
    this.addEventForButton();
  }

  addEventForButton(): void {
    this.button.element.addEventListener('click', (): void => {
      this.formRemoveError(this.inputLogin, this.inputEmail, this.inputPassword, this.confirmPassword);
      if (!this.isValidateName()) {
        this.formAddError(this.inputLogin);
      } else if (!this.isValidateEmail(this.inputEmail)) {
        this.formAddError(this.inputEmail);
      } else if (!this.isValidatePassword(this.inputPassword)) {
        this.formAddError(this.inputPassword);
      } else if (!this.areSamePasswords()) {
        this.showMessage();
        this.formAddError(this.confirmPassword);
      } else {
        createUser({ email: this.inputEmail.value, password: this.inputPassword.value, name: this.inputLogin.value });
        this.resetForm();
        this.hideMessage();
        this.destroyAuthorization();
      }
    });
  }

  resetForm(): void {
    this.inputEmail.value = '';
    this.inputPassword.value = '';
    this.inputLogin.value = '';
    this.confirmPassword.value = '';
  }

  formAddError(input: HTMLInputElement): void {
    input.parentElement?.classList.add('error');
    input.classList.add('error');
    input.focus();
  }

  formRemoveError(...inputs: HTMLInputElement[]): void {
    inputs.forEach((input: HTMLInputElement): void => {
      input.parentElement?.classList.remove('error');
      input.classList.remove('error');
    });
  }

  areSamePasswords(): boolean {
    return this.inputPassword.value === this.confirmPassword.value;
  }

  isValidateName(): boolean {
    return this.inputLogin.value.length >= 3;
  }

  showMessage(): void {
    this.messageForPass.element.classList.remove('message-active');
  }

  hideMessage(): void {
    this.messageForPass.element.classList.add('message-active');
  }

  destroySingUp(): void {
    this.remove();
  }
}

export default SingUp;
