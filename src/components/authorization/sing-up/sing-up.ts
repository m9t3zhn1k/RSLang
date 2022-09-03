import { BaseComponent } from '../../base-component/base-component';
import { createUser, getUser, loginUser } from '../../../controller/user-controller';
import { ILoginUser } from '../../../types/types';
import Loader from '../../loader/loader';
import { putUserStatistic } from '../../../controller/statistics-controller';

class SingUp extends BaseComponent {
  private button: BaseComponent;

  private inputEmail: HTMLInputElement;

  private inputPassword: HTMLInputElement;

  private inputLogin: HTMLInputElement;

  private form: BaseComponent;

  private confirmPassword: HTMLInputElement;

  private messageForPass: BaseComponent;

  private loader: Loader;

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
    super(parentNode, 'div', ['sing-up__wrapper']);
    this.loader = new Loader();
    this.form = new BaseComponent(this.element, 'form', ['form__body']);

    this.inputLogin = createItemForForm(this.form.element, 'Имя пользователя', 'text', 'Введите имя');
    this.inputEmail = createItemForForm(this.form.element, 'Адрес электронной почты', 'email', 'Введите адрес почты');
    this.inputPassword = createItemForForm(this.form.element, 'Пароль', 'password', 'Введите пароль');
    this.confirmPassword = createItemForForm(this.form.element, 'Подтвердите пароль', 'password', 'Подтвердите пароль');
    this.confirmPassword.name = 'password';
    this.messageForPass = new BaseComponent(
      this.confirmPassword.parentElement as HTMLElement,
      'p',
      ['form__message', 'message-active'],
      'Пароли, которые Вы ввели, не совпадают'
    );
    this.button = new BaseComponent(this.form.element, 'button', ['form__button'], 'Регистрация');
    this.button.element.addEventListener('click', this.handlerRegForm.bind(this));
  }

  public handlerRegForm(e: Event): void {
    e.preventDefault();
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
      this.registrationUser();
      this.resetForm();
      this.hideMessage();
      this.destroyAuthorization();
    }
  }

  async registrationUser(): Promise<void> {
    this.loader.createLoader(document.body);
    const email = this.inputEmail.value;
    const password = this.inputPassword.value;
    const response = await createUser({ email: email, password: password, name: this.inputLogin.value });
    if (response.status === 200) {
      const responseLogin: Response = await loginUser({ email: email, password: password });
      if (responseLogin.status === 200) {
        const content: ILoginUser = await responseLogin.json();
        localStorage.setItem('rslang-team58-user', JSON.stringify(content));
        getUser(content.userId, content.token);
        this.contentForButton('Выйти');
        await putUserStatistic({
          optional: {
            date: new Date().toLocaleDateString(),
            sprint: { answers: 0, newWords: 'null', correctAnswers: 0, longestCorrectSeries: 0 },
            audioChallenge: { answers: 0, newWords: 'null', correctAnswers: 0, longestCorrectSeries: 0 },
          },
        });
        document.location.reload();
      }
    }
    this.loader.destroy();
  }

  private resetForm(): void {
    this.inputEmail.value = '';
    this.inputPassword.value = '';
    this.inputLogin.value = '';
    this.confirmPassword.value = '';
  }

  private formAddError(input: HTMLInputElement): void {
    input.parentElement?.classList.add('error');
    input.classList.add('error');
    input.focus();
  }

  private formRemoveError(...inputs: HTMLInputElement[]): void {
    inputs.forEach((input: HTMLInputElement): void => {
      input.parentElement?.classList.remove('error');
      input.classList.remove('error');
    });
  }

  private areSamePasswords(): boolean {
    return this.inputPassword.value === this.confirmPassword.value;
  }

  private isValidateName(): boolean {
    return this.inputLogin.value.length >= 3;
  }

  private showMessage(): void {
    this.messageForPass.element.classList.remove('message-active');
  }

  private hideMessage(): void {
    this.messageForPass.element.classList.add('message-active');
  }
}

export default SingUp;
