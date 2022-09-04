import { IUserWord, IWord, WordResult, WordResultSynch } from '../../../types/types';
import { BaseComponent } from '../../base-component/base-component';
import imgSound from '../../../assets/sound.svg';
import { COUNT_WORDS } from '../../../constants/constants';
import { addGameResults } from '../../../controller/user-controller';
import { updateGameStatistics } from '../../../controller/statistics-controller';
import Loader from '../../loader/loader';

class AudioChallengeGame extends BaseComponent {
  private audio: HTMLAudioElement;

  private currentWords: number[] = [];

  private counterWord: number = 0;

  private wrongWord: number[] = [];

  private rightWord: number[] = [];

  private results: WordResult[] = [];

  private currentCorrectSeries: number = 0;

  private longestCorrectSeries: number = 0;

  private descriptionElement: {
    cardWrapper: BaseComponent;
    soundWord: BaseComponent;
    buttonAudio: BaseComponent;
    buttonAudioCard: BaseComponent;
    imgCard: HTMLImageElement;
  };

  private buttonsWord: BaseComponent[];

  private buttonAnswer: BaseComponent;

  private loader?: Loader;

  constructor(
    protected parentNode: HTMLElement,
    private dataWords: IWord[],
    private renderResultGame: (rightWord: number[], wrongWord: number[]) => void,
    private countRound: number
  ) {
    super(parentNode, 'div', ['audio-challenge__game']);
    this.audio = document.createElement('audio');
    this.descriptionElement = this.renderGameDescription(this.element);
    const audioСhallengeWords: BaseComponent = new BaseComponent(this.element, 'div', ['audio-challenge__words']);
    this.buttonsWord = this.createWordButtons(audioСhallengeWords.element);
    this.buttonAnswer = new BaseComponent(this.element, 'button', ['audio-challenge__btn', 'skip-game'], 'Не знаю');
    this.buttonAnswer.element.addEventListener('click', this.addEventForAnswer.bind(this));
    document.onkeydown = this.addKeyEvent.bind(this);
    this.buttonsWord.forEach((btn: BaseComponent): void => {
      btn.element.addEventListener('click', this.addHandlerForWords.bind(this, btn));
    });
  }

  private getRandomNum(): number[] {
    const arr: number[] = [this.counterWord];
    while (arr.length < COUNT_WORDS) {
      const num: number = Math.floor(Math.random() * this.dataWords.length);
      if (!arr.includes(num) && !this.currentWords.includes(num)) {
        arr.push(num);
        this.currentWords.push(num);
      }
    }
    this.currentWords = arr;
    return arr.sort((): number => Math.random() - 0.5);
  }

  private async addEventForAnswer(): Promise<void> {
    switch (this.buttonAnswer.element.textContent) {
      case 'Дальше':
        this.counterWord++;
        if (this.counterWord === this.countRound) {
          this.remove();
          document.onkeydown = null;
          this.loader = new Loader();
          this.loader.createLoader(document.body);
          await this.updateStatistics().then((): void => {
            this.loader?.destroy();
            this.renderResultGame(this.rightWord, this.wrongWord);
          });
          break;
        }
        this.setContent();
        this.removeFlagButtons();
        this.audio.src = this.dataWords[this.counterWord].audio;
        this.changeStatedBtn(false);
        this.buttonAnswer.element.textContent = 'Не знаю';
        this.descriptionElement.cardWrapper.element.classList.remove('active');
        this.descriptionElement.buttonAudio.element.classList.remove('inactive');
        this.audio.play();
        break;
      case 'Не знаю':
        this.wrongWord.push(this.counterWord);
        this.results.push({ word: this.dataWords[this.counterWord], result: false });
        this.findRightWord();
        this.changeStatedBtn(true);
        this.buttonAnswer.element.textContent = 'Дальше';
        this.descriptionElement.cardWrapper.element.classList.add('active');
        this.descriptionElement.buttonAudio.element.classList.add('inactive');
        break;
    }
  }

  private setContent(): void {
    const wordsNums: number[] = this.getRandomNum();
    this.buttonsWord.forEach((btnWord, i): void => {
      let indexWord = i;
      btnWord.element.textContent = `${++indexWord} ${this.dataWords[wordsNums[i]].wordTranslate}`;
    });
    this.descriptionElement.soundWord.element.textContent = this.dataWords[this.counterWord].word;
    this.descriptionElement.imgCard.src = this.dataWords[this.counterWord].image;
  }

  private renderGameDescription(parentElement: HTMLElement): {
    cardWrapper: BaseComponent;
    soundWord: BaseComponent;
    buttonAudio: BaseComponent;
    buttonAudioCard: BaseComponent;
    imgCard: HTMLImageElement;
  } {
    this.audio.src = this.dataWords[this.counterWord].audio;
    const descriptionWrapper: BaseComponent = new BaseComponent(parentElement, 'div', ['audio-challenge__description']);
    const buttonAudio: BaseComponent = new BaseComponent(descriptionWrapper.element, 'div', [
      'description__sound-button',
    ]);
    const imgForBtn = new BaseComponent(buttonAudio.element, 'img').element as HTMLImageElement;
    imgForBtn.src = imgSound;

    const cardWrapper: BaseComponent = new BaseComponent(descriptionWrapper.element, 'div', ['description__card']);
    const imgCard: HTMLImageElement = new BaseComponent(cardWrapper.element, 'img', ['card__img']).element as HTMLImageElement;
    const wordSound: BaseComponent = new BaseComponent(cardWrapper.element, 'div', ['card__sound']);
    const buttonAudioCard: BaseComponent = new BaseComponent(wordSound.element, 'div', ['card__sound-button']);
    (new BaseComponent(buttonAudioCard.element, 'img').element as HTMLImageElement).src = imgSound;
    const soundWord: BaseComponent = new BaseComponent(
      wordSound.element,
      'p',
      [],
      `${this.dataWords[this.counterWord].word}`
    );
    imgCard.src = this.dataWords[this.counterWord].image;
    buttonAudio.element.addEventListener('click', (): void => {
      this.addAnimate(buttonAudio.element);
      setTimeout(this.addAnimate, 220, buttonAudio.element);
      this.audio.play();
    });
    buttonAudioCard.element.addEventListener('click', (): void => {
      this.addAnimate(buttonAudioCard.element);
      setTimeout(this.addAnimate, 250, buttonAudioCard.element);
      this.audio.play();
    });

    return { cardWrapper, soundWord, buttonAudio, buttonAudioCard, imgCard };
  }

  private addAnimate(btn: HTMLElement): void {
    btn.classList.toggle('animate');
  }

  private createWordButtons(parentElement: HTMLElement): BaseComponent[] {
    this.audio.play();
    let counter: number = 1;
    return this.getRandomNum().map((num: number): BaseComponent => {
      return new BaseComponent(
        parentElement,
        'button',
        ['audio-challenge__word-btn'],
        `${counter++} ${this.dataWords[num].wordTranslate}`
      );
    });
  }

  private removeFlagButtons(): void {
    this.buttonsWord.forEach((button: BaseComponent): void => {
      button.element.classList.remove('right-word');
      button.element.classList.remove('wrong-word');
    });
  }

  private addHandlerForWords(btnWord: BaseComponent): void {
    let isCorrect: boolean = false;
    if (btnWord.element.textContent?.includes(this.dataWords[this.counterWord].wordTranslate)) {
      btnWord.element.classList.add('right-word');
      this.rightWord.push(this.counterWord);
      isCorrect = true;
    } else {
      btnWord.element.classList.add('wrong-word');
      this.wrongWord.push(this.counterWord);
      this.findRightWord();
      isCorrect = false;
    }
    this.results.push({ word: this.dataWords[this.counterWord], result: isCorrect });
    this.currentCorrectSeries = isCorrect ? this.currentCorrectSeries + 1 : 0;
    if (this.currentCorrectSeries > this.longestCorrectSeries) {
      this.longestCorrectSeries = this.currentCorrectSeries;
    }
    this.descriptionElement.buttonAudio.element.classList.add('inactive');
    this.descriptionElement.cardWrapper.element.classList.add('active');
    this.buttonAnswer.element.textContent = 'Дальше';
    this.changeStatedBtn(true);
  }

  private addKeyEvent(e: KeyboardEvent): void {
    switch (e.code) {
      case 'Numpad1':
      case 'Digit1':
      case 'Numpad2':
      case 'Digit2':
      case 'Numpad3':
      case 'Digit3':
      case 'Numpad4':
      case 'Digit4':
      case 'Numpad5':
      case 'Digit5':
        if (!(this.buttonsWord[+e.key - 1].element as HTMLButtonElement).disabled) {
          this.addHandlerForWords(this.buttonsWord[+e.key - 1]);
        }
        break;
      case 'Enter':
      case 'NumpadEnter':
        this.addEventForAnswer();
        break;
      case 'Space':
        this.addAnimate(this.descriptionElement.buttonAudio.element);
        setTimeout(this.addAnimate, 220, this.descriptionElement.buttonAudio.element);
        this.audio.play();
        break;
    }
  }

  private changeStatedBtn(state: boolean): void {
    this.buttonsWord.forEach((word: BaseComponent): void => {
      (word.element as HTMLButtonElement).disabled = state;
    });
  }

  private findRightWord(): void {
    this.buttonsWord.forEach((word: BaseComponent): void => {
      if (word.element.textContent?.includes(this.dataWords[this.counterWord].wordTranslate)) {
        word.element.classList.add('right-word');
      }
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
      await updateGameStatistics(data, this.longestCorrectSeries, 'audioChallenge');
    });
  }
}

export default AudioChallengeGame;
