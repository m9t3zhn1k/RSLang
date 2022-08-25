import { SECTIONS_COLORS } from "../../../../constants/constants";
import { addOptional, getToken } from "../../../../controller/user-controller";
import { IWord } from "../../../../types/types";
import { BaseComponentInnerHTML } from "../../../base-component-inner-HTML/base-component-inner-HTML";
import { BaseComponent } from "../../../base-component/base-component";
import './word-card.scss'

export default class WordCards extends BaseComponent {
    private wordData: IWord;
    private isDifSection: boolean;
    private allTextWrap: HTMLElement;
    private firstTextLineWrap: HTMLElement;
    private audioButton: HTMLElement;
    private buttonsWrap: HTMLElement;
    public addToDifButton: HTMLElement;
    public addtoLearnedButton: HTMLElement;
    public coloredPoint: HTMLElement;
    private gameResultsWrap: HTMLElement;
    private gameResultPositive: HTMLElement;
    private gameResultNegative: HTMLElement;

    constructor(parent: HTMLElement, wordData: IWord, sectionNum: keyof typeof SECTIONS_COLORS, isDifSection: boolean = false) {
        super(parent, 'div', ['word-card']);
        this.wordData = wordData;
        this.isDifSection = isDifSection;
        new BaseComponent(this.element, 'img', ['img'], '', {src: `${wordData.image}`});
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
        this.gameResultPositive = new BaseComponent(this.gameResultsWrap, 'div', ['game-result-pos']).element;
        this.gameResultNegative = new BaseComponent(this.gameResultsWrap, 'div', ['game-result-neg']).element;
        new BaseComponentInnerHTML(this.allTextWrap, wordData.wordTranslate);
        new BaseComponentInnerHTML(this.allTextWrap, wordData.textMeaning);
        new BaseComponentInnerHTML(this.allTextWrap, wordData.textMeaningTranslate);
        new BaseComponentInnerHTML(this.allTextWrap, wordData.textExample);
        new BaseComponentInnerHTML(this.allTextWrap, wordData.textExampleTranslate);
        
        this.audioButton.addEventListener('click', this.audioHandler);
        this.addToDifButton.addEventListener('click', this.buttonHandler);
        this.addtoLearnedButton.addEventListener('click', this.buttonHandler);
    
        this.addButtonsIfAuthorized();
    }
    
    private audioHandler: () => void = (): void => {
        const audio: HTMLAudioElement = (new Audio(this.wordData.audio));
        const meaning: HTMLAudioElement = (new Audio(this.wordData.audioMeaning));
        const example: HTMLAudioElement = (new Audio(this.wordData.audioExample));
        audio.play();
        audio.addEventListener('ended', ():void => {
            meaning.play();
            meaning.addEventListener('ended', (): Promise<void> => example.play())
        })
    }

    private buttonHandler: (e: Event) => void = (e: Event): void => {
        const button: HTMLElement = e.currentTarget as HTMLElement;
        button.classList.toggle('active-button')
        if (button.classList.contains('dif-button')) {
           this.element.classList.toggle('difficult-word')
            addOptional('dif', this.wordData.id)
        } else {
            this.element.classList.toggle('learned-word');
            this.element.classList.remove('difficult-word');
            this.addToDifButton.classList.remove('active-button');
            if (this.element.classList.contains('learned-word')) {
                this.addToDifButton.style.visibility = 'hidden'
            } else {
                this.addToDifButton.style.visibility = 'visible'
            }
            addOptional('learned', this.wordData.id)
        }
    };

    private addButtonsIfAuthorized: () => void = (): void => {
        if (this.isDifSection || !getToken()) {
            this.buttonsWrap.style.visibility = 'hidden'
        }
    }
}