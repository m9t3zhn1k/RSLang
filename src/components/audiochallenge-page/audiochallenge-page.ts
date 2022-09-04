import { COUNT_OF_WORDS_ON_PAGE, LANGUAGE_LEVELS, MAX_COUNT_OF_PAGES } from '../../constants/constants';
import { getWords } from '../../controller/words-controller';
import { IWord } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import imgSound from '../../assets/sound.svg';
import './audiochallenge-page.scss';
import { Router } from '../../router/router';
import AudioChallengeGame from './audio-challenge-game/audio-challenge-game';
import { getUserAgrGameWords, getUserId } from '../../controller/user-controller';
import Loader from '../loader/loader';
import { getLastPageFromLocalStorage } from '../../utils/storage/storage';

export class AudioChallengePage extends BaseComponent {
  private words: IWord[] = [];

  private levelGame: null | number = null;

  private isPlaying: boolean = false;

  private audio?: HTMLAudioElement;

  private soundButtons: HTMLElement[] = [];

  private countRound: number = COUNT_OF_WORDS_ON_PAGE;

  private loader: Loader;

  constructor(protected parentNode: HTMLElement, private router: Router) {
    super(parentNode, 'div', ['audio-challenge']);
    this.loader = new Loader();
    const previousPage: string | null = getLastPageFromLocalStorage();

    if (previousPage === 'ebook') {
      this.loader.createLoader(document.body);
      const group: number = Number(localStorage.getItem('sectionNum') ?? 1) - 1;
      const page: number = Number(localStorage.getItem('pageNum') ?? 1) - 1;

      this.initGame(group, page).then((): void => {
        this.renderGame();
        this.loader.destroy();
      });
    } else {
      this.renderStartGame();
    }

    this.renderLights();
  }

  private async getGameWords(group: number, page: number): Promise<IWord[]> {
    let words: IWord[] = [];
    if (getUserId()) {
      words = (await getUserAgrGameWords(group)).filter((word: IWord): boolean => {
        return !word.userWord?.optional?.isLearned && word.page <= page;
      });
    } else {
      while (page >= 0) {
        words = words.concat(await getWords(group, page));
        page -= 1;
      }
    }
    words.sort((a: IWord, b: IWord): number => b.page - a.page);
    return words;
  }

  private async initGame(group: number, page: number): Promise<void> {
    const words: IWord[] = await this.getGameWords(group, page);
    if (words.length < COUNT_OF_WORDS_ON_PAGE) {
      this.countRound = words.length;
      let newWord = await getWords(group, page + 1);
      if (!newWord.length) {
        newWord = await getWords(0, 0);
      }
      this.words = words.concat(newWord);
    } else {
      this.words = words.slice(0, COUNT_OF_WORDS_ON_PAGE);
      this.countRound = this.words.length;
    }
  }

  private generateRandomNum(): number {
    return Math.floor(Math.random() * MAX_COUNT_OF_PAGES);
  }

  private renderLights(): void {
    for (let i = 1; i <= 9; i++) {
      new BaseComponent(this.element, 'div', ['light', `x${i}`]);
    }
  }

  private renderStartGame(): void {
    const wrapperStart: BaseComponent = new BaseComponent(this.element, 'div', ['audio-challenge__start']);
    const rulesGame: BaseComponent = new BaseComponent(wrapperStart.element, 'div', ['audio-challenge__rules']);
    new BaseComponent(rulesGame.element, 'h2', ['rules__title'], 'Аудиовызов');
    new BaseComponent(
      rulesGame.element,
      'div',
      ['rules__text'],
      `Ты слышишь слово и видишь 5 вариантов его перевода. При этом не видишь, как это слово пишется по-английски.
      Твоя задача выбрать правильный перевод озвученного слова.`
    );
    const settingGame: BaseComponent = new BaseComponent(wrapperStart.element, 'div', ['audio-challenge__setting']);
    new BaseComponent(settingGame.element, 'h3', ['setting__title'], 'Выбери уровень:');
    const settingButtons: BaseComponent = new BaseComponent(settingGame.element, 'div', ['setting__buttons']);
    const levelButtons: BaseComponent[] = this.createButtonLevel(settingButtons.element);

    const buttonStartGame: BaseComponent = new BaseComponent(
      settingGame.element,
      'button',
      ['audio-challenge__btn', 'start-game'],
      'Старт',
      { disabled: '' }
    );

    this.addEventListenersForStartPage(levelButtons, buttonStartGame, wrapperStart);
  }

  private createButtonLevel(parentElement: HTMLElement): BaseComponent[] {
    return Object.keys(LANGUAGE_LEVELS).map((level: string): BaseComponent => {
      return new BaseComponent(parentElement, 'button', ['setting__button'], `${level}`);
    });
  }

  private addEventListenersForStartPage(
    languageLevels: BaseComponent[],
    startGameButton: BaseComponent,
    wrapperStart: BaseComponent
  ): void {
    languageLevels.forEach((level: BaseComponent): void => {
      level.element.addEventListener('click', (): void => {
        const key: string | null = level.element.textContent;
        this.levelGame = LANGUAGE_LEVELS[key as keyof typeof LANGUAGE_LEVELS];
        const isButtonActive = level.element.classList.toggle('button-active');
        languageLevels.forEach((button: BaseComponent): void => {
          if (button.element !== level.element) {
            button.element.classList.remove('button-active');
          }
        });
        (startGameButton.element as HTMLButtonElement).disabled = !isButtonActive;
      });
    });

    startGameButton.element.addEventListener('click', async (): Promise<void> => {
      const page: number = this.generateRandomNum();
      if (this.levelGame !== null) {
        this.loader.createLoader(document.body);
        wrapperStart.remove();
        const data: IWord[] = await getWords(this.levelGame, page);
        this.words = [];
        this.words.push(...data);
        this.countRound = this.words.length;
        this.renderGame();
        this.loader.destroy();
      }
    });
  }

  private renderGame(): void {
    new AudioChallengeGame(this.element, this.words, this.renderResultGame.bind(this), this.countRound);
  }

  private renderResultGame(arrRightWord: number[], arrWrongWord: number[]): void {
    const wrapperResult: BaseComponent = new BaseComponent(this.element, 'div', ['audio-challenge__result']);
    const wrapperResultButtons: BaseComponent = new BaseComponent(wrapperResult.element, 'div', ['result__buttons']);
    const buttonRepeat: BaseComponent = new BaseComponent(
      wrapperResultButtons.element,
      'button',
      ['audio-challenge__btn', 'result__but'],
      'Играть еще'
    );
    const buttonExit: BaseComponent = new BaseComponent(
      wrapperResultButtons.element,
      'button',
      ['audio-challenge__btn', 'result__but'],
      'К списку игр'
    );
    const rightWord: BaseComponent = new BaseComponent(wrapperResult.element, 'div', ['result__right']);
    const wrongWord: BaseComponent = new BaseComponent(wrapperResult.element, 'div', ['result__wrong']);

    new BaseComponent(rightWord.element, 'h4', ['result__title'], `ЗНАЮ: ${arrRightWord.length}`);
    this.renderResultItem(arrRightWord, rightWord.element);

    new BaseComponent(wrongWord.element, 'h4', ['result__title'], `ОШИБОК: ${arrWrongWord.length}`);
    this.renderResultItem(arrWrongWord, wrongWord.element);

    buttonRepeat.element.addEventListener('click', (): void => {
      wrapperResult.remove();
      wrapperResultButtons.remove();
      this.renderStartGame();
    });

    buttonExit.element.addEventListener('click', (): void => {
      this.remove();
      this.router.updatePage('games');
    });
  }

  private renderResultItem(wordsNum: number[], parentElement: HTMLElement): void {
    wordsNum.forEach((word: number): void => {
      const itemWrapper: BaseComponent = new BaseComponent(parentElement, 'div', ['word-item']);
      const audio: HTMLAudioElement = document.createElement('audio');
      audio.src = this.words[word].audio;

      const soundItem: BaseComponent = new BaseComponent(itemWrapper.element, 'div', ['word-item__sound']);
      const buttonAudioCard: BaseComponent = new BaseComponent(soundItem.element, 'button', [
        'word-item__sound-button',
      ]);
      (new BaseComponent(buttonAudioCard.element, 'img').element as HTMLImageElement).src = imgSound;

      soundItem.element.addEventListener('click', (): void => {
        this.playAudio(this.words[word].audio, soundItem.element);
        this.soundButtons.push(soundItem.element);
      });
      new BaseComponent(itemWrapper.element, 'span', ['word-item__word'], `${this.words[word].word} `);
      new BaseComponent(
        itemWrapper.element,
        'span',
        ['word-item__word-transcript'],
        `${this.words[word].transcription} `
      );
      new BaseComponent(
        itemWrapper.element,
        'span',
        ['word-item__word-translate'],
        `${this.words[word].wordTranslate}`
      );
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
