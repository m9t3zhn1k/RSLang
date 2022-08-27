import { BaseComponent } from '../base-component/base-component';
import { Timer } from '../timer/timer';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  private container: HTMLElement;

  public group: number | null = null;

  public page: number | null = null;

  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper', 'wrapper__sprint-game']);
    const previousPage: string | null = localStorage.getItem('lastPage');
    this.container = new BaseComponent(this.element, 'div', ['container', 'game__container']).element;
    if (previousPage !== 'ebook') {
      this.renderStartPage();
    }
    this.renderLights();
  }

  private renderStartPage(): void {
    new BaseComponent(this.container, 'h2', ['game__title'], 'Спринт');
    const textContainer: HTMLElement = new BaseComponent(this.container, 'div', ['game__text']).element;
    new BaseComponent(
      textContainer,
      'p',
      ['game__text_about'],
      'Игра на скорость, где требуется за 30 секунд перевести как можно большее количество слов и набрать максимальное количество баллов'
    );
    const rulesContainer: HTMLElement = new BaseComponent(textContainer, 'div', ['game__text_rules']).element;
    new BaseComponent(this.container, 'h3', ['game__levels_title'], 'Уровень игры');
    const languageLevelsContainer: HTMLElement = new BaseComponent(this.container, 'div', ['game__levels']).element;
    const languageLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(
      (level: string, index: number): HTMLElement =>
        new BaseComponent(languageLevelsContainer, 'button', ['button', 'game__button_level'], level, {
          id: `${index}`,
        }).element
    );
    const startGameButton: HTMLButtonElement = new BaseComponent(
      this.container,
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
    startGameButton.addEventListener('click', this.renderGamePage.bind(this));
  }

  private renderGamePage(): void {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    const timer: Timer = new Timer(this.container, ['timer'], 30);
    const pointsContainer: HTMLElement = new BaseComponent(this.container, 'div', ['game__points']).element;
    new BaseComponent(pointsContainer, 'p', ['game__points_score'], '0 очков').element;
    const pointsIncreaseValue: HTMLElement = new BaseComponent(pointsContainer, 'p', ['game__points_increment'], '+10 очков').element;
    const pointsAnswerIndicators: HTMLElement = new BaseComponent(pointsContainer, 'div', ['game__points_indicators']).element;
    const answerIndicator1: HTMLElement = new BaseComponent(pointsAnswerIndicators, 'div', ['game__points_indicator-item']).element;
    const answerIndicator2: HTMLElement = new BaseComponent(pointsAnswerIndicators, 'div', ['game__points_indicator-item']).element;
    const answerIndicator3: HTMLElement = new BaseComponent(pointsAnswerIndicators, 'div', ['game__points_indicator-item']).element;
    const wordsContainer: HTMLElement = new BaseComponent(this.container, 'div', ['game__words']).element;
    const wordEN: HTMLElement =  new BaseComponent(
      wordsContainer,
      'span',
      ['game__word'],
      'transport'
    ).element;
    new BaseComponent(wordsContainer, 'span', [], 'переводится как');
    const wordRU: HTMLElement =  new BaseComponent(wordsContainer, 'span', ['game__word'], 'транспорт').element;
    const buttonsContainer: HTMLElement = new BaseComponent(this.container, 'div', ['game__answers']).element;
    const answerLeftButton: HTMLElement =  new BaseComponent(
      buttonsContainer,
      'button',
      ['game__answer', 'game__answer_left'],
      'Верно'
    ).element;
    const answerRightButton: HTMLElement =  new BaseComponent(
      buttonsContainer,
      'button',
      ['game__answer', 'game__answer_right'],
      'Неверно'
    ).element;
  }

  private renderLights(): void {
    for (let i = 1; i <= 9; i++) {
      new BaseComponent(this.element, 'div', ['light', `x${i}`]);
    }
  }

  private getRandomNumber(startNumber: number, finishNumber: number): number {
    return Math.round(Math.random() * (finishNumber - startNumber) + startNumber);
  }
}
