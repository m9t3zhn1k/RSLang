import { BaseComponent } from '../base-component/base-component';
import timer_icon from '../../assets/icons/timer.svg';
import './timer.scss';
import { SprintResultPage } from '../sprint-page/sprint-game-results';
import { IWord } from '../../types/types';

export class Timer extends BaseComponent {
  private timePassed: number = 0;

  public timeLeft: number;

  private timerInterval: number | null = null;

  public timerInput: HTMLInputElement;

  public results: { word: IWord; result: boolean }[] = [];

  public score: number = 0;

  constructor(private parent: HTMLElement, className: string[], private timeLimit: number) {
    super(parent, 'div', className);
    const timerIcon: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.timeLeft = this.timeLimit;
    this.timerInput = new BaseComponent(this.element, 'input', ['timer__input'], '', { type: 'text' })
      .element as HTMLInputElement;
    this.timerInput.value = `${this.timeLeft}`;
    this.renderTimerIcon(timerIcon, this.element);
  }

  public onTimesUp(): void {
    clearInterval(this.timerInterval as number);
  }

  public startTimer(): void {
    this.timerInterval = +setInterval((): void => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.timeLimit - this.timePassed;
      this.timerInput.value = `${this.timeLeft}`;
      if (this.timeLeft === 0) {
        this.onTimesUp();
        new SprintResultPage(this.parent, this.results, this.score);
      }
    }, 1000);
  }

  private renderTimerIcon(element: SVGSVGElement, container: HTMLElement): void {
    const useElem: SVGUseElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    element.setAttributeNS(null, 'class', 'timer__icon');
    useElem.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `${timer_icon}#timer`);
    element.appendChild(useElem);
    container.appendChild(element);
  }
}
