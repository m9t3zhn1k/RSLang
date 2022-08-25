
import { START_PAGINATION_PAGE, MAX_COUNT_OF_PAGES, MAX_COUNT_OF_SECTIONS_FOR_AUTHORIZED, MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED } from '../../../../constants/constants';
import { getToken } from '../../../../controller/user-controller';
import { BaseComponent } from '../../../base-component/base-component';
import Ebook from '../../ebook';
import './pagination.scss'

export default class Pagination extends BaseComponent {
    public leftArrow: HTMLElement;
    public rightArrow: HTMLElement;
    public label: HTMLElement;
    public labelName: HTMLElement;
    public labelPageNum: HTMLElement;
    public maxPageNum: number;
    public currentPageNum: number;
    public parentInstance: Ebook;
    public leftRewind: HTMLElement;
    public rightRewind: HTMLElement;

    constructor(parent: HTMLElement, paginationType: string, parentInstance: Ebook) {
        super(parent, 'div', ['pagination-wrap']);
        this.parentInstance = parentInstance;
        this.leftRewind = new BaseComponent(this.element,'div', ['arrow-button'], '<<').element;
        this.leftArrow = new BaseComponent(this.element, 'div', ['arrow-button'], "<").element;
        this.label = new BaseComponent(this.element, 'div', ['label']).element;
        this.rightArrow = new BaseComponent(this.element,'div', ['arrow-button'], ">").element;
        this.rightRewind = new BaseComponent(this.element,'div', ['arrow-button'], '>>').element;
        this.labelName = new BaseComponent(this.label,'div', ['label-name']).element;
        this.labelPageNum = new BaseComponent(this.label, 'div', ['label-page-num']).element;

        switch (paginationType) {
            case 'section':
                this.labelName.textContent = 'Раздел';
                this.currentPageNum = +((window.localStorage.getItem('sectionNum') as string) ?? START_PAGINATION_PAGE);
                this.labelPageNum.textContent = `${this.currentPageNum}`;
                const token: string | null = getToken();
                this.maxPageNum = token ? MAX_COUNT_OF_SECTIONS_FOR_AUTHORIZED : MAX_COUNT_OF_SECTIONS_FOR_UNAUTHORIZED;
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

    public addEventListenersToArrows: () => void = (): void => {
        this.leftArrow.addEventListener('click', (e:Event): void => {
            if (this.currentPageNum !== START_PAGINATION_PAGE) {
                this.currentPageNum -= 1;
                this.rightArrow.classList.remove('nonactive');
                this.parentInstance.drawCards();
            }
            if (this.currentPageNum === START_PAGINATION_PAGE) {
                this.leftArrow.classList.add('nonactive');
            };
            this.labelPageNum.textContent = `${this.currentPageNum}`;
        });
        this.rightArrow.addEventListener('click', (e:Event): void => {
            if (this.currentPageNum !== this.maxPageNum) {
                this.currentPageNum += 1;
                this.leftArrow.classList.remove('nonactive');
                this.parentInstance.drawCards();
            }
            if (this.currentPageNum === this.maxPageNum) {
                this.rightArrow.classList.add('nonactive');
            }
            this.labelPageNum.textContent = `${this.currentPageNum}`;
        });
        this.leftRewind.addEventListener('click', ():void => {
            if (this.currentPageNum !== START_PAGINATION_PAGE) {
                this.currentPageNum = START_PAGINATION_PAGE;
                this.parentInstance.drawCards();
                this.labelPageNum.textContent = `${this.currentPageNum}`;
            }
        });
        this.rightRewind.addEventListener('click', ():void => {
            if (this.currentPageNum !== this.maxPageNum) {
                this.currentPageNum = this.maxPageNum;
                this.parentInstance.drawCards();
                this.labelPageNum.textContent = `${this.currentPageNum}`;
            }
        })
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
        })
    };
}