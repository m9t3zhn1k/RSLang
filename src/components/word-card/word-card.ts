import { SECTIONS_COLORS } from '../../constants/constants';
import { addOptional, getUserId, getOneUserWord, getToken } from '../../controller/user-controller';
import { IWord, IUserWord, IWordCards, Optional } from '../../types/types';
import { BaseComponentInnerHTML } from '../base-component-inner-HTML/base-component-inner-HTML';
import { BaseComponent } from '../base-component/base-component';
import Ebook from '../ebook/ebook';
import './word-card.scss';

export default class WordCards extends BaseComponent implements IWordCards {
  private allTextWrap: HTMLElement;

  private firstTextLineWrap: HTMLElement;

  private audioButton: HTMLElement;

  private buttonsWrap: HTMLElement;

  public addToDifButton;

  public addtoLearnedButton;

  private coloredPoint: HTMLElement;

  private gameResultsWrap: HTMLElement;

  private gameResultPositive: HTMLElement;

  private gameResultNegative: HTMLElement;

  private audioArr: HTMLAudioElement[];

  constructor(
    private parent: HTMLElement,
    private ebook: Ebook,
    private wordData: IWord,
    sectionNum: keyof typeof SECTIONS_COLORS,
    private isDifSection: boolean = false,
    private optional: Optional | undefined = undefined
  ) {
    super(parent, 'div', ['word-card']);
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
    this.setStylesForControls();
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
    if (this.isDifSection) {
      this.element.remove();
    }
    if (button.classList.contains('dif-button')) {
      this.element.classList.toggle('difficult-word');
      if (this.element.classList.contains('difficult-word')) {
        this.ebook.numOfLearnedOrDifCards += 1;
      } else {
        this.ebook.numOfLearnedOrDifCards -= 1;
      }
      addOptional('dif', this.wordData.id);
    } else {
      this.element.classList.toggle('learned-word');
      this.element.classList.remove('difficult-word');
      this.addToDifButton.classList.remove('active-button');
      if (this.element.classList.contains('learned-word')) {
        this.ebook.numOfLearnedOrDifCards += 1;
        this.addToDifButton.classList.add('hidden-element');
      } else {
        this.ebook.numOfLearnedOrDifCards -= 1;
        this.addToDifButton.classList.remove('hidden-element');
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
    }
    this.ebook.addLearnedStyleToPage();
  };

  private addButtonsIfAuthorized: () => void = (): void => {
    if (!getToken()) {
      this.buttonsWrap.classList.add('hidden-element');
    }
  };

  private setStylesForControls: () => Promise<void> = async (): Promise<void> => {
    if (this.isDifSection) {
      this.element.classList.add('difficult-word');
      this.addToDifButton.classList.add('active-button');
    };
    if (this.optional && Object.hasOwn(this.optional, "correctAnswers")) {
      this.gameResultsWrap.classList.add('visible-element');
      this.gameResultPositive.textContent = `${this.optional.correctAnswers}`;
      this.gameResultNegative.textContent = `${this.optional.incorrectAnswers}`;
    }

  };
}
