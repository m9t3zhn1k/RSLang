import './ebook.scss';
import '../word-card/word-card.scss';
import { IWord, IUserWord, IEbook, Optional } from '../../types/types';
import { getOneUserWord, getAllUsersWords, getUserId } from '../../controller/user-controller';
import { getWords, getOneWord } from '../../controller/words-controller';
import { BaseComponent } from '../base-component/base-component';
import { Router } from '../../router/router';
import { MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED, SECTIONS_COLORS } from '../../constants/constants';
import Pagination from '../pagination/pagination';
import WordCards from '../word-card/word-card';

export default class Ebook extends BaseComponent implements IEbook {
  private controls: HTMLElement;

  private cardsView: HTMLElement;

  private sectionPagination: Pagination;

  private audioGame: HTMLButtonElement;

  private sprintGame: HTMLButtonElement;

  public audioFlag;

  public pagePagination;

  public numOfLearnedOrDifCards;

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
    this.numOfLearnedOrDifCards = 0;
    router.navigateApp([this.audioGame, this.sprintGame]);
    this.drawCards();
  }

  public drawCards = async (): Promise<void> => {
    const pageNumForApi: number = this.pagePagination.currentPageNum - 1;
    const sectionNumForApi: number = this.sectionPagination.currentPageNum - 1;
    const wordsArr: IWord[] = await getWords(sectionNumForApi, pageNumForApi);
    this.saveStageToLocalStorage();
    this.cardsView.classList.remove('learned-page');
    this.pagePagination.label.classList.remove('learned-page-label');
    this.numOfLearnedOrDifCards = 0;
    this.cardsView.innerHTML = '';

    if (sectionNumForApi !== MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED) {
      this.drawRegularSection(wordsArr, sectionNumForApi);
    } else {
      this.drawDifWordsSection();
    }
  };

  private saveStageToLocalStorage = (): void => {
    window.localStorage.setItem('sectionNum', `${this.sectionPagination.currentPageNum}`);
    window.localStorage.setItem('pageNum', `${this.pagePagination.currentPageNum}`);
  };

  private drawRegularSection = (wordsArr: IWord[], sectionNumForApi: number): void => {
    const userId: string | null = getUserId();
    this.audioGame.classList.remove('non-active-button');
    this.sprintGame.classList.remove('non-active-button');
    const wordsCardsArr: Promise<HTMLElement>[] = wordsArr.map(async (wordData: IWord): Promise<HTMLElement> => {
      const optional: Optional | undefined = (await getOneUserWord(userId, wordData.id))?.optional;
      const wordCard: WordCards = new WordCards(
        this.cardsView,
        this,
        wordData,
        `${sectionNumForApi}` as keyof typeof SECTIONS_COLORS,
        false,
        optional
      );

      if (optional?.isLearned) {
        this.numOfLearnedOrDifCards += 1;
        wordCard.addtoLearnedButton.classList.add('active-button');
        wordCard.addToDifButton.classList.add('hidden-element');
        wordCard.element.classList.add('learned-word');
      } else if (optional?.isDif) {
        this.numOfLearnedOrDifCards += 1;
        wordCard.addToDifButton.classList.add('active-button');
        wordCard.element.classList.add('difficult-word');
      }
      return wordCard.element;
    });
    this.pagePagination.element.classList.remove('display-none');
    Promise.all(wordsCardsArr).then((): void => {
      this.addLearnedStyleToPage();
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
