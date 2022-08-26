import { SECTIONS_COLORS } from '../../constants/constants';
import { addOptional, getUserId, getOneUserWord, getToken } from '../../controller/user-controller';
import { IWord, IUserWord } from '../../types/types';
import { BaseComponentInnerHTML } from '../base-component-inner-HTML/base-component-inner-HTML';
import { BaseComponent } from '../base-component/base-component';
import './word-card.scss';

export default class WordCards extends BaseComponent {
  private allTextWrap: HTMLElement;

  private firstTextLineWrap: HTMLElement;

  private audioButton: HTMLElement;

  private buttonsWrap: HTMLElement;

  public addToDifButton: HTMLElement;

  public addtoLearnedButton: HTMLElement;

  private coloredPoint: HTMLElement;

  private gameResultsWrap: HTMLElement;

  private gameResultPositive: HTMLElement;

  private gameResultNegative: HTMLElement;

  private audioArr: HTMLAudioElement[];

  constructor(
    public parent: HTMLElement,
    public wordData: IWord,
    sectionNum: keyof typeof SECTIONS_COLORS,
    public isDifSection: boolean = false,
    public drawCards?: () => Promise<void>
  ) {
    super(parent, 'div', ['word-card']);

    this.isDifSection = isDifSection;
    new BaseComponent(this.element, 'img', ['img'], '', { src: `${wordData.image}` });
    this.allTextWrap = new BaseComponent(this.element, 'div', ['allTextWrap']).element;
    this.firstTextLineWrap = new BaseComponent(this.allTextWrap, 'div', ['first-text-line-wrap']).element;
    this.coloredPoint = new BaseComponent(this.firstTextLineWrap, 'div', ['point']).element;
    this.coloredPoint.style.background = SECTIONS_COLORS[`${sectionNum}`];
    this.buttonsWrap = new BaseComponent(this.element, 'div', ['buttons-wrap']).element;
    new BaseComponent(this.firstTextLineWrap, 'div', [], `${wordData.word} - ${wordData.transcription}`);
    this.audioButton = new BaseComponent(this.firstTextLineWrap, 'div', ['audio-button']).element;
    this.addToDifButton = new BaseComponent(this.buttonsWrap, 'div', ['dif-button']).element;
    this.addtoLearnedButton = new BaseComponent(this.buttonsWrap, 'div', ['learned-button']).element;
    this.gameResultsWrap = new BaseComponent(this.buttonsWrap, 'div', ['game-result-wrap']).element;
    this.gameResultPositive = new BaseComponent(this.gameResultsWrap, 'div', ['game-result-pos'], '0').element;
    this.gameResultNegative = new BaseComponent(this.gameResultsWrap, 'div', ['game-result-neg'], '0').element;
    this.audioArr = [
      new Audio(this.wordData.audio),
      new Audio(this.wordData.audioMeaning),
      new Audio(this.wordData.audioExample),
    ];

    this.audioButton.addEventListener('click', this.playAudioHandler);
    this.addToDifButton.addEventListener('click', this.buttonHandler);
    this.addtoLearnedButton.addEventListener('click', this.buttonHandler);
    this.addButtonsIfAuthorized();
    this.addStyleforDifWords();
    this.addText(wordData);
  }

  private addText = (wordData: IWord): void => {
    new BaseComponentInnerHTML(this.allTextWrap, wordData.wordTranslate);
    new BaseComponentInnerHTML(this.allTextWrap, wordData.textMeaning);
    new BaseComponentInnerHTML(this.allTextWrap, wordData.textMeaningTranslate);
    new BaseComponentInnerHTML(this.allTextWrap, wordData.textExample);
    new BaseComponentInnerHTML(this.allTextWrap, wordData.textExampleTranslate);
  };

  private playAudioHandler: () => void = (): void => {
    if (this.audioButton.classList.contains('stop-audio')) {
      this.audioButton.classList.remove('stop-audio');
      this.audioArr.forEach((audio: HTMLAudioElement): void => {
        audio.pause();
        audio.currentTime = 0;
      });
    } else {
      this.audioArr[0].play();
      this.audioArr[0].addEventListener('ended', (): void => {
        this.audioArr[1].play();
        this.audioArr[1].addEventListener('ended', (): void => {
          this.audioArr[2].play();
          this.audioArr[2].addEventListener('ended', (): void => {
            this.audioButton.classList.remove('stop-audio');
          });
        });
      });
    }
  };

  private buttonHandler: (e: Event) => void = (e: Event): void => {
    const button: HTMLElement = e.currentTarget as HTMLElement;
    button.classList.toggle('active-button');
    if (button.classList.contains('dif-button')) {
      this.element.classList.toggle('difficult-word');
      addOptional('dif', this.wordData.id);
      if (this.isDifSection) {
        this.element.remove();
      }
    } else {
      this.element.classList.toggle('learned-word');
      this.element.classList.remove('difficult-word');
      this.addToDifButton.classList.remove('active-button');
      if (this.element.classList.contains('learned-word')) {
        this.addToDifButton.style.visibility = 'hidden';
      } else {
        this.addToDifButton.style.visibility = 'visible';
        if (getUserId()) {
          getOneUserWord(getUserId(), this.wordData.id).then((res: IUserWord | null): void => {
            if (res?.optional.isDif) {
              this.addToDifButton.classList.add('active-button');
              this.element.classList.add('difficult-word');
            }
          });
        }
      }
      addOptional('learned', this.wordData.id);
      if (this.isDifSection) {
        this.element.remove();
      }
    }
  };

  private addButtonsIfAuthorized: () => void = (): void => {
    if (!getToken()) {
      this.buttonsWrap.style.visibility = 'hidden';
    }
  };

  private addStyleforDifWords = (): void => {
    if (this.isDifSection) {
      this.element.classList.add('difficult-word');
      this.addToDifButton.classList.add('active-button');
    }
  };
}
