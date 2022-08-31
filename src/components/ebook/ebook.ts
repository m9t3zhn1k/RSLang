import './ebook.scss';
import '../word-card/word-card.scss';
import { IWord, IUserWord, IEbook } from '../../types/types';
import { getOneUserWord, getAllUsersWords } from '../../controller/user-controller';
import { getWords, getOneWord } from '../../controller/words-controller';
import { BaseComponent } from '../base-component/base-component';
import Button from '../button/button';
import { Router } from '../../router/router';
import { MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED, SECTIONS_COLORS } from '../../constants/constants';
import Pagination from '../pagination/pagination';
import WordCards from '../word-card/word-card';

export default class Ebook extends BaseComponent implements IEbook {
  private controls: HTMLElement;

  private cardsView: HTMLElement;

  private sectionPagination: Pagination;

  public pagePagination;

  private audioGame: HTMLElement;

  private sprintGame: HTMLElement;

  private data: IWord[];

  constructor(parent: HTMLElement, router: Router) {
    super(parent, 'div', ['ebook']);
    new BaseComponent(this.element, 'div', ['title'], 'Учебник');
    this.controls = new BaseComponent(this.element, 'div', ['controls']).element;
    this.cardsView = new BaseComponent(this.element, 'div', ['cards-view']).element;

    this.sectionPagination = new Pagination(this.controls, 'section', this);
    this.pagePagination = new Pagination(this.controls, 'page', this);
    this.cardsView = new BaseComponent(this.element, 'div', ['cards-view']).element;
    this.audioGame = new Button(this.controls, 'Аудиовызов').element;
    this.sprintGame = new Button(this.controls, 'Спринт').element;
    this.audioGame.id = 'audiochallenge';
    this.sprintGame.id = 'sprint';
    this.data = [];
    this.audioGame.addEventListener('click', (): void => {
      this.remove();
      new AudioChallengePage(parent, router, this.data);
    });
    this.drawCards();
    this.saveStageToLocalStorage();
  }

  public drawCards = async (): Promise<void> => {
    const pageNumForApi: number = this.pagePagination.currentPageNum - 1;
    const sectionNumForApi: number = this.sectionPagination.currentPageNum - 1;
    const wordsArr: IWord[] = await getWords(sectionNumForApi, pageNumForApi);
    this.data = [];
    this.data.push(...wordsArr);
    this.cardsView.classList.remove('learned-page');
    this.pagePagination.label.classList.remove('learned-page-label');
    this.cardsView.innerHTML = '';

    if (sectionNumForApi !== MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED) {
      this.drawRegularSection(wordsArr, sectionNumForApi);
    } else {
      this.drawDifWordsSection();
    }
  };

  private saveStageToLocalStorage = (): void => {
    window.addEventListener('beforeunload', (): void => {
      window.localStorage.setItem('sectionNum', `${this.sectionPagination.currentPageNum}`);
      window.localStorage.setItem('pageNum', `${this.pagePagination.currentPageNum}`);
    });
  };

  private drawRegularSection = (wordsArr: IWord[], sectionNumForApi: number): void => {
    this.audioGame.classList.remove('non-active-button');
    this.sprintGame.classList.remove('non-active-button');
    const wordsCardsArr: Promise<HTMLElement>[] = wordsArr.map(async (wordData: IWord): Promise<HTMLElement> => {
      const wordCard: WordCards = new WordCards(
        this.cardsView,
        wordData,
        `${sectionNumForApi}` as keyof typeof SECTIONS_COLORS
      );
      const options: IUserWord | null = await getOneUserWord(wordData.id);
      if (options?.optional.isLearned) {
        wordCard.addtoLearnedButton.classList.add('active-button');
        wordCard.addToDifButton.style.visibility = 'hidden';
        wordCard.element.classList.add('learned-word');
      } else if (options?.optional.isDif) {
        wordCard.addToDifButton.classList.add('active-button');
        wordCard.element.classList.add('difficult-word');
      }
      return wordCard.element;
    });
    this.pagePagination.element.style.display = 'flex';
    Promise.all(wordsCardsArr).then((res: HTMLElement[]): void => {
      if (res.every((card: HTMLElement): boolean => card.classList.contains('learned-word'))) {
        this.cardsView.classList.add('learned-page');
        this.pagePagination.label.classList.add('learned-page-label');
      }
    });
  };

  private drawDifWordsSection = async (): Promise<void> => {
    const allUsersWords: IUserWord[] | null | void = await getAllUsersWords();
    new BaseComponent(this.cardsView, 'p', ['dif-words-title'], 'Сложные слова');
    this.pagePagination.element.style.display = 'none';
    this.audioGame.classList.add('non-active-button');
    this.sprintGame.classList.add('non-active-button');

    if (allUsersWords) {
      allUsersWords
        .filter((userWord: IUserWord): boolean => userWord.optional.isDif && !userWord.optional.isLearned)
        .forEach(async (userWord: IUserWord): Promise<void> => {
          const wordData: IWord = await getOneWord(userWord.wordId);
          new WordCards(this.cardsView, wordData, '6', true);
        });
    }
  };
}
