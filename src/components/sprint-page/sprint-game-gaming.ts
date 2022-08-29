import { getWords } from "../../controller/words-controller";
import { IWord } from "../../types/types";
import { BaseComponent } from "../base-component/base-component";
import { Timer } from "../timer/timer";

export class SprintGamePage {
  private gameWords: IWord[] | null = null;

  private gameResults: { word: IWord, result: boolean }[] = [];

  private timer: Timer;

  private pointsCounter: HTMLElement;

  private pointsIncrementValue: HTMLElement;

  private answerIndicator1: HTMLElement;

  private answerIndicator2: HTMLElement;

  private answerIndicator3: HTMLElement;

  private wordEN: HTMLElement;

  private wordRU: HTMLElement;

  private answerTrueButton: HTMLElement;

  private answerFalseButton: HTMLElement;

  constructor(private parent: HTMLElement, private group: number, private page: number) {
    this.prepareGamePage();
    this.timer = new Timer(this.parent, ['timer'], 30);
    const pointsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__points']).element;
    const pointsAnswerIndicators: HTMLElement = new BaseComponent(pointsContainer, 'div', ['game__points_indicators'])
    .element;
    const wordsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__words']).element;
    const buttonsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__answers']).element;
    this.pointsCounter = new BaseComponent(pointsContainer, 'p', ['game__points_score'], '0 очков').element;
    this.pointsIncrementValue = new BaseComponent(
      pointsContainer,
      'p',
      ['game__points_increment'],
      '+10 очков'
    ).element;
    this.answerIndicator1 = new BaseComponent(pointsAnswerIndicators, 'div', [
      'game__points_indicator-item',
    ]).element;
    this.answerIndicator2 = new BaseComponent(pointsAnswerIndicators, 'div', [
      'game__points_indicator-item',
    ]).element;
    this.answerIndicator3 = new BaseComponent(pointsAnswerIndicators, 'div', [
      'game__points_indicator-item',
    ]).element;
    this.wordEN = new BaseComponent(wordsContainer, 'span', ['game__word'], 'transport').element;
    new BaseComponent(wordsContainer, 'span', [], 'переводится как');
    this.wordRU = new BaseComponent(wordsContainer, 'span', ['game__word'], 'транспорт').element;
    this.answerTrueButton = new BaseComponent(
      buttonsContainer,
      'button',
      ['game__answer', 'game__answer_true'],
      'Верно'
    ).element;
    this.answerFalseButton = new BaseComponent(
      buttonsContainer,
      'button',
      ['game__answer', 'game__answer_false'],
      'Неверно'
    ).element;
  }

  private async prepareGamePage(): Promise<void> {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }
    this.gameWords = this.shuffle(await getWords(this.group, this.page));
    console.log(this.gameWords);
  }

  private getRandomNumber(startNumber: number, finishNumber: number): number {
    return Math.round(Math.random() * (finishNumber - startNumber) + startNumber);
  }

  private shuffle = (array: IWord[]): IWord[] => {
    const arraycopy = [...array];
    for (let i = arraycopy.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [arraycopy[i], arraycopy[j]] = [arraycopy[j], arraycopy[i]];
    }
    return arraycopy;
  };
}
