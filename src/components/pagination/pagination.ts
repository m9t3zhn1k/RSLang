import {
  START_PAGINATION_PAGE,
  MAX_COUNT_OF_SECTIONS_FOR_AUTHORIZED,
  MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED,
  MAX_COUNT_OF_PAGES,
} from '../../constants/constants';
import { getToken } from '../../controller/user-controller';
import { IPagination } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import Ebook from '../ebook/ebook';
import './pagination.scss';

export default class Pagination extends BaseComponent implements IPagination {
  private leftArrow: HTMLElement;

  private rightArrow: HTMLElement;

  public label;

  private labelName: HTMLElement;

  private labelPageNum: HTMLElement;

  private maxPageNum: number;

  public currentPageNum;

  private leftRewind: HTMLElement;

  private rightRewind: HTMLElement;

  constructor(parent: HTMLElement, paginationType: string, private parentInstance: Ebook) {
    super(parent, 'div', ['pagination-wrap']);
    this.leftRewind = new BaseComponent(this.element, 'div', ['arrow-button'], '<<').element;
    this.leftArrow = new BaseComponent(this.element, 'div', ['arrow-button'], '<').element;
    this.label = new BaseComponent(this.element, 'div', ['label']).element;
    this.rightArrow = new BaseComponent(this.element, 'div', ['arrow-button'], '>').element;
    this.rightRewind = new BaseComponent(this.element, 'div', ['arrow-button'], '>>').element;
    this.labelName = new BaseComponent(this.label, 'div', ['label-name']).element;
    this.labelPageNum = new BaseComponent(this.label, 'div', ['label-page-num']).element;

    switch (paginationType) {
      case 'section':
        this.labelName.textContent = 'Раздел';
        this.currentPageNum = +((window.localStorage.getItem('sectionNum') as string) ?? START_PAGINATION_PAGE);
        this.labelPageNum.textContent = `${this.currentPageNum}`;
        this.maxPageNum = getToken() ? MAX_COUNT_OF_SECTIONS_FOR_AUTHORIZED : MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED;
        this.addEventListenerToSectionButtons();
        break;

      default:
        this.labelName.textContent = 'Страница';
        this.currentPageNum = +((window.localStorage.getItem('pageNum') as string) ?? START_PAGINATION_PAGE);
        this.labelPageNum.textContent = `${this.currentPageNum}`;
        this.maxPageNum = MAX_COUNT_OF_PAGES;
    }
    this.addEventListenersToArrows();
  }

  private addEventListenersToArrows: () => void = (): void => {
    this.leftArrow.addEventListener('click', (): void => {
      if (this.currentPageNum !== START_PAGINATION_PAGE) {
        this.currentPageNum -= 1;
        this.labelPageNum.textContent = `${this.currentPageNum}`;
        this.parentInstance.drawCards();
      }
    });
    this.rightArrow.addEventListener('click', (): void => {
      if (this.currentPageNum !== this.maxPageNum) {
        this.currentPageNum += 1;
        this.labelPageNum.textContent = `${this.currentPageNum}`;
        this.parentInstance.drawCards();
      }
    });
    this.leftRewind.addEventListener('click', (): void => {
      if (this.currentPageNum !== START_PAGINATION_PAGE) {
        this.currentPageNum = START_PAGINATION_PAGE;
        this.parentInstance.drawCards();
        this.labelPageNum.textContent = `${this.currentPageNum}`;
      }
    });
    this.rightRewind.addEventListener('click', (): void => {
      if (this.currentPageNum !== this.maxPageNum) {
        this.currentPageNum = this.maxPageNum;
        this.parentInstance.drawCards();
        this.labelPageNum.textContent = `${this.currentPageNum}`;
      }
    });
  };

  private addEventListenerToSectionButtons = (): void => {
    this.leftArrow.addEventListener('click', (): void => {
      if (this.currentPageNum !== START_PAGINATION_PAGE) {
        this.parentInstance.pagePagination.currentPageNum = START_PAGINATION_PAGE;
        this.parentInstance.pagePagination.labelPageNum.textContent = `${START_PAGINATION_PAGE}`;
      }
    });
    this.rightArrow.addEventListener('click', (): void => {
      if (this.currentPageNum !== this.maxPageNum) {
        this.parentInstance.pagePagination.currentPageNum = START_PAGINATION_PAGE;
        this.parentInstance.pagePagination.labelPageNum.textContent = `${START_PAGINATION_PAGE}`;
      }
    });
    this.leftRewind.addEventListener('click', (): void => {
      if (this.currentPageNum !== START_PAGINATION_PAGE) {
        this.parentInstance.pagePagination.currentPageNum = START_PAGINATION_PAGE;
        this.parentInstance.pagePagination.labelPageNum.textContent = `${START_PAGINATION_PAGE}`;
      }
    });
    this.rightRewind.addEventListener('click', (): void => {
      if (this.currentPageNum !== this.maxPageNum) {
        this.parentInstance.pagePagination.currentPageNum = START_PAGINATION_PAGE;
        this.parentInstance.pagePagination.labelPageNum.textContent = `${START_PAGINATION_PAGE}`;
      }
    });
  };
}
