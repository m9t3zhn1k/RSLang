import { BaseComponent } from '../../base-component/base-component';
import { createToken, loginUser, getUser } from '../../../controller/user-controller';
import { ILoginUser } from '../../../types/types';

class SingIn extends BaseComponent {
  private button: BaseComponent;

  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private form: BaseComponent;

  private message: BaseComponent;

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
    public destroyAuthorization: () => void,
    public contentForButton: (content: string) => void
  ) {
    super(parentNode, 'div', ['sing-in__wrapper']);
    this.form = new BaseComponent(this.element, 'form', ['form__body']);

    this.inputEmail = createItemForForm(this.form.element, 'Адрес электронной почты', 'email', 'Введите адрес почты');
    this.inputPassword = createItemForForm(this.form.element, 'Пароль', 'password', 'Введите пароль');

    this.message = new BaseComponent(this.element, 'p', ['form__message'], ' ');
    this.button = new BaseComponent(this.element, 'button', ['form__button'], 'Войти');
    (this.button.element as HTMLButtonElement).type = 'submit';

    this.button.element.addEventListener('click', (): void => {
      this.formRemoveError(this.inputEmail, this.inputPassword);
      if (!this.isValidateEmail(this.inputEmail)) {
        this.formAddError(this.inputEmail);
      } else if (!this.isValidatePassword(this.inputPassword)) {
        this.formAddError(this.inputPassword);
      } else {
        this.loginUser(this.inputEmail.value, this.inputPassword.value);
      }
    });
  }

  async loginUser(email: string, password: string): Promise<void> {
    const response: Response = await loginUser({ email: email, password: password });
    switch (response.status) {
      case 200: {
        const content: ILoginUser = await response.json();
        localStorage.setItem('rslang-team58-user', JSON.stringify(content));
        getUser(content.userId, content.token);
        createToken(content.userId, content.refreshToken);
        this.resetForm();
        this.destroyAuthorization();
        this.contentForButton('Выйти');
        break;
      }
      case 403:
      case 401: {
        this.addContentForMessage('Ввели не верный пароль');
        break;
      }
      case 404: {
        this.addContentForMessage('Такого пользователя не существует');
        break;
      }
    }
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

  addContentForMessage(content: string): void {
    this.message.element.textContent = content;
  }

  resetForm(): void {
    this.inputEmail.value = '';
    this.inputPassword.value = '';
  }
}

export default SingIn;
