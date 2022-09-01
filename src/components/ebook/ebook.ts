import './ebook.scss';
import '../word-card/word-card.scss';
import { IWord, IUserWord, IEbook } from '../../types/types';
import { getAllUsersWords, getUserId, getUserAgrWords } from '../../controller/user-controller';
import { getWords, getOneWord } from '../../controller/words-controller';
import { BaseComponent } from '../base-component/base-component';
import { Router } from '../../router/router';
import { MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED, SECTIONS_COLORS } from '../../constants/constants';
import Pagination from '../pagination/pagination';
import WordCards from '../word-card/word-card';
import { AudioChallengePage } from '../audiochallenge-page/audiochallenge-page';

export default class Ebook extends BaseComponent implements IEbook {
  private controls: HTMLElement;

  private cardsView: HTMLElement;

  private sectionPagination: Pagination;

  public pagePagination: Pagination;

  private audioGame: HTMLButtonElement;

  private sprintGame: HTMLButtonElement;

  public audioFlag;

  public numOfLearnedOrDifCards;

  private data: IWord[];

  constructor(parent: HTMLElement, router: Router) {
    super(parent, 'div', ['ebook']);
    this.audioFlag = true;
    new BaseComponent(this.element, 'div', ['title'], 'Учебник');
    this.controls = new BaseComponent(this.element, 'div', ['controls']).element;
    this.cardsView = new BaseComponent(this.element, 'div', ['cards-view']).element;
    this.sectionPagination = new Pagination(this.controls, 'section', this);
    this.pagePagination = new Pagination(this.controls, 'page', this);
    this.cardsView = new BaseComponent(this.element, 'div', ['cards-view']).element;
    this.audioGame = new BaseComponent(this.controls, 'button', ['button-game'], 'Аудиовызов')
      .element as HTMLButtonElement;
    this.sprintGame = new BaseComponent(this.controls, 'button', ['button-game'], 'Спринт')
      .element as HTMLButtonElement;
    this.audioGame.id = 'audiochallenge';
    this.sprintGame.id = 'sprint';
    this.data = [];
    this.audioGame.addEventListener('click', (): void => {
      this.remove();
      new AudioChallengePage(parent, router, this.data);
    });
    this.numOfLearnedOrDifCards = 0;
    router.navigateApp([this.sprintGame]);
    this.drawCards();
  }

  public drawCards = async (): Promise<void> => {
    const pageNumForApi: number = this.pagePagination.currentPageNum - 1;
    const sectionNumForApi: number = this.sectionPagination.currentPageNum - 1;
    let words: IWord[];
    if (getUserId()) {
      words = await getUserAgrWords(sectionNumForApi, pageNumForApi);
    } else {
      words = await getWords(sectionNumForApi, pageNumForApi);
    }
    this.cardsView.classList.remove('learned-page');
    this.pagePagination.label.classList.remove('learned-page-label');
    this.numOfLearnedOrDifCards = 0;
    this.cardsView.innerHTML = '';

    if (sectionNumForApi !== MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED) {
      this.drawRegularSection(words, sectionNumForApi);
    } else {
      this.drawDifWordsSection();
    }
    this.saveStageToLocalStorage();
  };

  private saveStageToLocalStorage = (): void => {
    window.localStorage.setItem('sectionNum', `${this.sectionPagination.currentPageNum}`);
    window.localStorage.setItem('pageNum', `${this.pagePagination.currentPageNum}`);
  };

  private drawRegularSection = (words: IWord[], sectionNumForApi: number): void => {
    this.audioGame.classList.remove('non-active-button');
    this.sprintGame.classList.remove('non-active-button');
    const wordsCards: HTMLElement[] = words.map((wordData: IWord): HTMLElement => {
      const wordCard: WordCards = new WordCards(
        this.cardsView,
        this,
        wordData,
        `${sectionNumForApi}` as keyof typeof SECTIONS_COLORS,
        false,
        wordData.userWord?.optional
      );
      if (wordData.userWord?.optional.isLearned) {
        wordCard.addtoLearnedButton.classList.add('active-button');
        wordCard.addToDifButton.classList.add('hidden-element');
        wordCard.element.classList.add('learned-word');
      } else if (wordData.userWord?.optional?.isDif) {
        wordCard.addToDifButton.classList.add('active-button');
        wordCard.element.classList.add('difficult-word');
      }
      return wordCard.element;
    });
    this.pagePagination.element.style.display = 'flex';
    Promise.all(wordsCards).then((res: HTMLElement[]): void => {
      if (res.every((card: HTMLElement): boolean => card.classList.contains('learned-word'))) {
        this.cardsView.classList.add('learned-page');
        this.pagePagination.label.classList.add('learned-page-label');
      }
    });
  };

  private drawDifWordsSection = async (): Promise<void> => {
    const allUsersWords: IUserWord[] | null | void = await getAllUsersWords();
    new BaseComponent(this.cardsView, 'p', ['dif-words-title'], 'Сложные слова');
    this.pagePagination.element.classList.add('display-none');
    this.audioGame.classList.add('non-active-button');
    this.sprintGame.classList.add('non-active-button');

    if (allUsersWords) {
      allUsersWords
        .filter((userWord: IUserWord): boolean => userWord.optional.isDif && !userWord.optional.isLearned)
        .forEach(async (userWord: IUserWord): Promise<void> => {
          const wordData: IWord = await getOneWord(userWord.wordId);
          new WordCards(this.cardsView, this, wordData, '6', true);
        });
    }
  };

  public addLearnedStyleToPage = (): void => {
    if (this.numOfLearnedOrDifCards >= 20) {
      this.numOfLearnedOrDifCards = 20;
      this.cardsView.classList.add('learned-page');
      this.pagePagination.label.classList.add('learned-page-label');
      this.audioGame.classList.add('non-active-button-game');
      this.sprintGame.classList.add('non-active-button-game');
      this.audioGame.disabled = true;
      this.sprintGame.disabled = true;
    } else {
      this.cardsView.classList.remove('learned-page');
      this.pagePagination.label.classList.remove('learned-page-label');
      this.audioGame.classList.remove('non-active-button-game');
      this.sprintGame.classList.remove('non-active-button-game');
      this.audioGame.disabled = false;
      this.sprintGame.disabled = false;
    }
  };
}
