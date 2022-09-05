import { updateGameStatistics } from '../../controller/statistics-controller';
import { addGameResults } from '../../controller/user-controller';
import { Router } from '../../router/router';
import { IUserWord, WordResult, WordResultSynch } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import Loader from '../loader/loader';
import { SprintGamePage } from './sprint-game-gaming';
import { SprintStartPage } from './sprint-game-start';

export class SprintResultPage {
  private correctAnswers: WordResult[] = [];

  private wrongAnswers: WordResult[] = [];

  private audio?: HTMLAudioElement;

  private isPlaying: boolean = false;

  private soundButtons: HTMLElement[] = [];

  private loader: Loader;

  constructor(
    private parent: HTMLElement,
    private results: WordResult[],
    private score: number,
    private router: Router,
    private longestSeries: number
  ) {
    this.cleanParent();
    this.loader = new Loader();
    this.loader.createLoader(document.body);
    this.updateStatistics().then((): void => {
      this.loader.destroy();
      this.devideResults(this.results);
      this.renderResults();
    });
  }

  private async updateStatistics(): Promise<void> {
    await Promise.all(
      this.results.map(async (item: WordResult): Promise<WordResultSynch | undefined> => {
        const word: IUserWord | void = await addGameResults(item.word.id, item.result);
        if (word) {
          return { word, result: item.result };
        }
      })
    ).then(async (data: (WordResultSynch | undefined)[]): Promise<void> => {
      await updateGameStatistics(data, this.longestSeries, 'sprint');
    });
  }

  private renderResults(): void {
    const buttonsContainer: HTMLElement = new BaseComponent(this.parent, 'div', ['game__results_buttons-container'])
      .element;
    const retryGameButton: HTMLElement = new BaseComponent(
      buttonsContainer,
      'button',
      ['game__results_button'],
      'Играть еще'
    ).element;
    const goToEbookButton: HTMLElement = new BaseComponent(
      buttonsContainer,
      'button',
      ['game__results_button'],
      'Перейти в учебник',
      { id: 'ebook' }
    ).element;
    new BaseComponent(this.parent, 'p', ['game__results_score'], `Набрано ${this.score} очков`);
    const correctAnswersContainer: HTMLElement = new BaseComponent(this.parent, 'div', [
      'game__results_answers-container',
    ]).element;
    const wrongAnswersContainer: HTMLElement = new BaseComponent(this.parent, 'div', [
      'game__results_answers-container',
    ]).element;
    if (this.correctAnswers.length) {
      new BaseComponent(correctAnswersContainer, 'p', ['game__results_answer-title'], 'Правильные ответы');
      this.renderWordResults(this.correctAnswers, correctAnswersContainer);
    }
    if (this.wrongAnswers.length) {
      new BaseComponent(wrongAnswersContainer, 'p', ['game__results_answer-title'], 'Ошибочные ответы');
      this.renderWordResults(this.wrongAnswers, wrongAnswersContainer);
    }
    retryGameButton.addEventListener('click', (): void => {
      this.cleanParent();
      new SprintStartPage(this.parent, SprintGamePage, this.router);
    });
    this.router.navigateApp([goToEbookButton]);
  }

  private cleanParent(): void {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }
  }

  private devideResults(results: WordResult[]): void {
    this.correctAnswers = results.filter((item: WordResult): boolean => item.result);
    this.wrongAnswers = results.filter((item: WordResult): boolean => !item.result);
  }

  private renderWordResults(results: WordResult[], parent: HTMLElement): void {
    results.forEach((result: WordResult): void => {
      const wordContainer: HTMLElement = new BaseComponent(parent, 'div', ['game__results_answer']).element;
      const soundIcon: HTMLElement = new BaseComponent(wordContainer, 'div', ['game__results_answer-button']).element;
      new BaseComponent(wordContainer, 'span', [], `${result.word.word}`);
      new BaseComponent(wordContainer, 'span', [], `${result.word.transcription}`);
      new BaseComponent(wordContainer, 'span', [], `${result.word.wordTranslate}`);
      soundIcon.addEventListener('click', (): void => {
        this.playAudio(result.word.audio, soundIcon);
        this.soundButtons.push(soundIcon);
      });
    });
  }

  private playAudio(src: string, element: HTMLElement): void {
    if (!this.isPlaying || this.audio?.ended) {
      this.audio = new Audio();
      this.audio.volume = 0.1;
      this.audio.src = src;
      this.audio.play();
      this.isPlaying = true;
      element.classList.add('active');
    } else if (this.isPlaying) {
      const activeButton: HTMLElement = this.soundButtons.filter((button: HTMLElement): boolean =>
        button.classList.contains('active')
      )[0];
      this.audio?.pause();
      this.isPlaying = false;
      element.classList.remove('active');
      this.soundButtons.forEach((button: HTMLElement): void => button.classList.remove('active'));
      if (element !== activeButton) {
        this.playAudio(src, element);
      }
    }
  }
}
