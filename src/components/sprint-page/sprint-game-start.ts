import { BaseComponent } from "../base-component/base-component";
import { SprintGamePage } from "./sprint-game-gaming";

export class SprintStartPage {
  private group: number | null = null;

  private page: number | null = null;

  constructor(private parent: HTMLElement, private nextPage: typeof SprintGamePage) {
    this.renderStartPage();
  }

  private renderStartPage(): void {
    new BaseComponent(this.parent, 'h2', ['game__title'], 'Спринт');
    const textContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__text']).element;
    new BaseComponent(
      textContainer,
      'p',
      ['game__text_about'],
      'Игра на скорость, где требуется за 30 секунд перевести как можно большее количество слов и набрать максимальное количество баллов'
    );
    const rulesContainer: HTMLElement = new BaseComponent(textContainer, 'div', ['game__text_rules']).element;
    new BaseComponent(this.parent, 'h3', ['game__levels_title'], 'Уровень игры');
    const languageLevelsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__levels']).element;
    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(
      (level: string, index: number): HTMLElement =>
        new BaseComponent(languageLevelsContainer, 'button', ['button', 'game__button_level'], level, {
          id: `${index}`,
        }).element
    );
    const startGameButton: HTMLButtonElement = new BaseComponent(
      this.parent,
      'button',
      ['button', 'game__button_start'],
      'Начать игру',
      { disabled: '' }
    ).element as HTMLButtonElement;
    new BaseComponent(
      rulesContainer,
      'span',
      ['game__text_about'],
      'Для управления игрой используйте мышь или клавиши:'
    );
    new BaseComponent(rulesContainer, 'div', ['game__text_key']).element.innerHTML = '&#129044;';
    new BaseComponent(rulesContainer, 'p', [], ' для выбора варианта ответа «Верно»');
    new BaseComponent(rulesContainer, 'div', ['game__text_key']).element.innerHTML = '&#129046;';
    new BaseComponent(rulesContainer, 'p', [], ' для выбора варианта ответа «Неверно»');
    this.addEventListenersForStartPage(languageLevels, startGameButton);
  }

  private addEventListenersForStartPage(languageLevels: HTMLElement[], startGameButton: HTMLButtonElement): void {
    languageLevels.forEach((level: HTMLElement): void =>
      level.addEventListener('click', (): void => {
        level.classList.toggle('checked');
        if (level.classList.contains('checked')) {
          this.group = +level.id.replace(/[^0-9]/g, '');
          this.page = this.getRandomNumber(0, 29);
          startGameButton.disabled = false;
        } else {
          this.group = null;
          this.page = null;
          startGameButton.disabled = true;
        }
        languageLevels.forEach((button: HTMLElement): void => {
          if (button !== level) {
            button.classList.remove('checked');
          }
        });
      })
    );
    startGameButton.addEventListener('click', () => new this.nextPage(this.parent, this.group!, this.page!));
  }

  private getRandomNumber(startNumber: number, finishNumber: number): number {
    return Math.round(Math.random() * (finishNumber - startNumber) + startNumber);
  }
}
