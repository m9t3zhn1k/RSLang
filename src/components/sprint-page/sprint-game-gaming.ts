import { PLAYLIST, SPRINT_DURATION } from '../../constants/constants';
import { getUserAgrGameWords, getUserId } from '../../controller/user-controller';
import { getWords } from '../../controller/words-controller';
import { Router } from '../../router/router';
import { IWord, WordResult } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import Loader from '../loader/loader';
import { Timer } from '../timer/timer';
import { SprintResultPage } from './sprint-game-results';

export class SprintGamePage {
  private gameWords: IWord[] = [];

  private currentWordIndex: number = 0;

  private currentCorrectSeries: number = 0;

  private longestCorrectSeries: number = 0;

  private currentWord: IWord | null = null;

  private gameResults: WordResult[] = [];

  private timer: Timer;

  private pointsCounter: HTMLElement;

  private pointsIncrementValue: number = 10;

  private pointsIncrementIndicator: HTMLElement;

  private answerIndicator1: HTMLElement;

  private answerIndicator2: HTMLElement;

  private answerIndicator3: HTMLElement;

  private wordEN: HTMLElement;

  private wordRU: HTMLElement;

  private buttonsContainer: HTMLElement;

  private answerTrueButton: HTMLButtonElement;

  private answerFalseButton: HTMLButtonElement;

  private audio: HTMLAudioElement = new Audio();

  private isGameEnded: boolean = false;

  private loader: Loader;

  constructor(private parent: HTMLElement, private group: number, private page: number, private router: Router) {
    this.parent.classList.add('hidden');
    this.loader = new Loader();
    this.loader.createLoader(document.body);
    this.initGame();
    this.timer = new Timer(this.parent, ['timer'], SPRINT_DURATION, this.router, this.longestCorrectSeries);
    const pointsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__points']).element;
    const pointsAnswerIndicators: HTMLElement = new BaseComponent(pointsContainer, 'div', ['game__points_indicators'])
      .element;
    const wordsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__words']).element;
    this.buttonsContainer = new BaseComponent(this.parent, 'div', ['game__answers']).element;
    this.pointsCounter = new BaseComponent(pointsContainer, 'p', ['game__points_score'], '0 очков').element;
    this.pointsIncrementIndicator = new BaseComponent(
      pointsContainer,
      'p',
      ['game__points_increment'],
      `+${this.pointsIncrementValue} очков`
    ).element;
    this.answerIndicator1 = new BaseComponent(pointsAnswerIndicators, 'div', ['game__points_indicator-item']).element;
    this.answerIndicator2 = new BaseComponent(pointsAnswerIndicators, 'div', ['game__points_indicator-item']).element;
    this.answerIndicator3 = new BaseComponent(pointsAnswerIndicators, 'div', ['game__points_indicator-item']).element;
    this.wordEN = new BaseComponent(wordsContainer, 'span', ['game__word']).element;
    new BaseComponent(wordsContainer, 'span', [], 'переводится как');
    this.wordRU = new BaseComponent(wordsContainer, 'span', ['game__word']).element;
    this.answerTrueButton = new BaseComponent(
      this.buttonsContainer,
      'button',
      ['game__answer', 'game__answer_true'],
      'Верно'
    ).element as HTMLButtonElement;
    this.answerFalseButton = new BaseComponent(
      this.buttonsContainer,
      'button',
      ['game__answer', 'game__answer_false'],
      'Неверно'
    ).element as HTMLButtonElement;
  }

  private addEventListenersToButtons(): void {
    this.answerTrueButton.addEventListener('click', this.addWordResult.bind(this));
    this.answerFalseButton.addEventListener('click', this.addWordResult.bind(this));
    window.onkeyup = this.handleKeyEvent.bind(this);
  }

  private updateGameWord(): void {
    if (this.currentWordIndex) {
      this.wordEN.classList.add('hidden');
      this.wordRU.classList.add('hidden');
    }
    this.currentWord = this.gameWords[this.currentWordIndex];
    const isSettingWordTranslateCorrect: boolean = Math.random() > 0.5;
    this.wordEN.textContent = this.currentWord.word.toLowerCase();
    this.wordRU.textContent =
      isSettingWordTranslateCorrect === true
        ? this.currentWord.wordTranslate.toLowerCase()
        : this.gameWords[this.getRandomNumber(0, this.gameWords.length - 1, this.currentWordIndex)].wordTranslate;
    setTimeout((): void => {
      this.wordEN.classList.remove('hidden');
      this.wordRU.classList.remove('hidden');
    }, 150);
  }

  private async isAnswerCorrect(e: Event): Promise<boolean> {
    let isCorrect: boolean = false;
    if ((e as KeyboardEvent).code === 'ArrowLeft' || (e as KeyboardEvent).code === 'ArrowRight') {
      isCorrect =
        ((e as KeyboardEvent).code === 'ArrowLeft' && this.currentWord?.wordTranslate === this.wordRU.textContent) ||
        ((e as KeyboardEvent).code === 'ArrowRight' && this.currentWord?.wordTranslate !== this.wordRU.textContent);
    } else if (e instanceof MouseEvent) {
      const activeButton: HTMLElement = e.target as HTMLElement;
      isCorrect =
        (activeButton.textContent === 'Верно' && this.currentWord?.wordTranslate === this.wordRU.textContent) ||
        (activeButton.textContent === 'Неверно' && this.currentWord?.wordTranslate !== this.wordRU.textContent);
    }
    this.handleAnswer(isCorrect);
    this.paintAnswer(isCorrect);
    return isCorrect;
  }

  private paintAnswer(answer: boolean): void {
    if (answer) {
      this.answerFalseButton.classList.add('correct');
      this.answerTrueButton.classList.add('correct');
    } else {
      this.answerFalseButton.classList.add('wrong');
      this.answerTrueButton.classList.add('wrong');
    }
    setTimeout((): void => {
      this.answerFalseButton.classList.remove('correct');
      this.answerTrueButton.classList.remove('correct');
      this.answerFalseButton.classList.remove('wrong');
      this.answerTrueButton.classList.remove('wrong');
    }, 200);
  }

  private handleAnswer(answer: boolean): void {
    const [first, second, third]: HTMLElement[] = [this.answerIndicator1, this.answerIndicator2, this.answerIndicator3];
    if (answer) {
      this.playAudio(0);
      if (!this.isAnswerIndicatorGreen([first])) {
        this.setAnswerIndicatorGreen(first);
        this.updateScore();
        return;
      }
      if (this.isAnswerIndicatorGreen([third])) {
        this.removeAnswerIndicatorsGreen([first, second, third]);
        this.setAnswerIndicatorGreen(first);
        this.setPointsIncrementValue(true);
        this.updateScore();
        return;
      }
      if (this.isAnswerIndicatorGreen([second])) {
        this.setAnswerIndicatorGreen(third);
        this.updateScore();
        return;
      }
      if (this.isAnswerIndicatorGreen([first])) {
        this.setAnswerIndicatorGreen(second);
        this.updateScore();
        return;
      }
    } else {
      this.playAudio(1);
      this.removeAnswerIndicatorsGreen([first, second, third]);
      this.setPointsIncrementValue(false);
      return;
    }
  }

  private isAnswerIndicatorGreen(indicators: HTMLElement[]): boolean {
    return indicators.every((indicator: HTMLElement): boolean => indicator.classList.contains('active'));
  }

  private setAnswerIndicatorGreen(indicator: HTMLElement): void {
    indicator.classList.add('active');
  }

  private removeAnswerIndicatorsGreen(indicators: HTMLElement[]): void {
    indicators.forEach((indicator: HTMLElement): void => indicator.classList.remove('active'));
  }

  private setPointsIncrementValue(isLevelUp: boolean): void {
    if (isLevelUp) {
      this.pointsIncrementValue += 10;
    } else {
      this.pointsIncrementValue = 10;
    }
    this.pointsIncrementIndicator.textContent = `+${this.pointsIncrementValue} очков`;
  }

  private updateScore(): void {
    if (this.pointsCounter.textContent) {
      this.pointsCounter.textContent = `${parseInt(this.pointsCounter.textContent) + this.pointsIncrementValue} очков`;
      this.timer.score = parseInt(this.pointsCounter.textContent) + this.pointsIncrementValue;
    }
  }

  private async addWordResult(e: Event): Promise<void> {
    if (this.isGameEnded) {
      return;
    }
    const result: boolean = await this.isAnswerCorrect(e);
    if (this.currentWord) {
      this.gameResults.push({ word: this.currentWord, result: result });
      this.timer.results.push({ word: this.currentWord, result: result });
      this.currentCorrectSeries = result ? this.currentCorrectSeries + 1 : 0;
      if (this.currentCorrectSeries > this.longestCorrectSeries) {
        this.longestCorrectSeries = this.currentCorrectSeries;
        this.timer.longestSeries = this.currentCorrectSeries;
      }
    }
    this.setNextGameWord();
  }

  private setNextGameWord(): void {
    this.currentWordIndex += 1;
    if (this.currentWordIndex <= this.gameWords.length - 1) {
      this.updateGameWord();
    } else {
      this.timer.onTimesUp();
      this.wordEN.textContent = 'Слова в выборке закончились';
      (this.wordEN.nextElementSibling as HTMLElement).style.visibility = 'hidden';
      this.wordRU.textContent = 'Для просмотра результатов нажмите Enter';
      this.wordRU.classList.add('transformed');
      this.isGameEnded = true;
      this.answerTrueButton.remove();
      this.answerFalseButton.remove();
      const renderResultPageButton: HTMLButtonElement = new BaseComponent(
        this.buttonsContainer,
        'button',
        ['game__answer', 'game__answer_result'],
        'Результат игры'
      ).element as HTMLButtonElement;
      renderResultPageButton.onclick = (): void => {
        new SprintResultPage(this.parent, this.gameResults, this.timer.score, this.router, this.longestCorrectSeries);
      };
    }
  }

  private handleKeyEvent(e: KeyboardEvent): void {
    switch (e.code) {
      case 'Enter':
      case 'NumpadEnter':
        if (this.isGameEnded) {
          new SprintResultPage(this.parent, this.gameResults, this.timer.score, this.router, this.longestCorrectSeries);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (!this.isGameEnded) {
          this.addWordResult(e);
        }
        break;
    }
  }

  private async initGame(): Promise<void> {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }
    this.gameWords = await this.getGameWords();
    this.parent.classList.remove('hidden');
    this.loader.destroy();
    this.timer.startTimer();
    this.addEventListenersToButtons();
    this.updateGameWord();
  }

  private async getGameWords(): Promise<IWord[]> {
    let words: IWord[] = [];
    if (getUserId()) {
      words = (await getUserAgrGameWords(this.group)).filter(
        (word: IWord): boolean => !word.userWord?.optional?.isLearned && word.page <= this.page
      );
    } else {
      while (this.page >= 0) {
        words = words.concat(await getWords(this.group, this.page));
        this.page -= 1;
      }
    }
    words.sort((a: IWord, b: IWord): number => b.page - a.page);
    return words;
  }

  private getRandomNumber(startNumber: number, finishNumber: number, exception?: number): number {
    const number: number = Math.round(Math.random() * (finishNumber - startNumber) + startNumber);
    if (number === exception) {
      return this.getRandomNumber(startNumber, finishNumber, exception);
    }
    return number;
  }

  private playAudio(index: number): void {
    this.audio.volume = 0.1;
    this.audio.src = PLAYLIST[index].src;
    this.audio.play();
  }
}
