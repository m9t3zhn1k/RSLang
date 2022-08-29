import { IWord } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';

export class SprintResultPage {
  private correctAnswers: { word: IWord; result: boolean }[] = [];

  private wrongAnswers: { word: IWord; result: boolean }[] = [];

  private audio: HTMLAudioElement = new Audio();

  constructor(private parent: HTMLElement, private results: { word: IWord; result: boolean }[], private score: number) {
    this.devideResults(this.results);
    this.renderResults();
  }

  private renderResults(): void {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }
    new BaseComponent(this.parent, 'p', ['game__results_score'], `Набрано ${this.score} очков`);
    const correctAnswersContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__results_answers-container']).element;
    const wrongAnswersContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__results_answers-container']).element;
    new BaseComponent(correctAnswersContainer, 'p', ['game__results_answer-title'], 'Правильные ответы');
    new BaseComponent(wrongAnswersContainer, 'p', ['game__results_answer-title'], 'Ошибочные ответы');
    this.renderWordResults(this.correctAnswers, correctAnswersContainer);
    this.renderWordResults(this.wrongAnswers, wrongAnswersContainer);
  }

  private devideResults(results: { word: IWord; result: boolean }[]): void {
    this.correctAnswers = results.filter((item: { word: IWord; result: boolean }): boolean => item.result);
    this.wrongAnswers = results.filter((item: { word: IWord; result: boolean }): boolean => !item.result);
  }

  private renderWordResults(results: { word: IWord; result: boolean }[], parent: HTMLElement): void {
    results.forEach((result: { word: IWord; result: boolean }): void => {
      const wordContainer: HTMLElement = new BaseComponent(parent, 'div', ['game__results_answer']).element;
      const soundIcon: HTMLElement = new BaseComponent(wordContainer, 'div', ['game__results_answer-button']).element;
      new BaseComponent(wordContainer, 'span', [], `${result.word.word}`);
      new BaseComponent(wordContainer, 'span', [], `${result.word.transcription}`);
      new BaseComponent(wordContainer, 'span', [], `${result.word.wordTranslate}`);
      soundIcon.addEventListener('click', () => {
        this.playAudio(result.word.audio, soundIcon);
        soundIcon.classList.add('active');
      });
    });
  }

  private playAudio(src: string, element: HTMLElement): void {
    this.audio.volume = 0.1;
    this.audio.src = src;
    this.audio.play();
    this.audio.addEventListener('ended', () => element.classList.remove('active'));
  };
}
