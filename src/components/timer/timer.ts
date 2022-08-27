import { BaseComponent } from '../base-component/base-component';
import timer_icon from '../../assets/icons/timer.svg';
import './timer.scss';

export class Timer extends BaseComponent {
  private timePassed: number = 0;

  public timeLeft: number;

  private timerInterval: number | null = null;

  private timerLabel: HTMLElement;

  constructor(parent: HTMLElement, className: string[], private timeLimit: number) {
    super(parent, 'div', className);
    const timerIcon: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.timeLeft = this.timeLimit;
    this.timerLabel = new BaseComponent(this.element, 'span', ['timer__label'], `${this.timeLeft}`).element;
    this.startTimer();
    this.renderTimerIcon(timerIcon, this.element);
  }

  private onTimesUp(): void {
    clearInterval(this.timerInterval as number);
  }

  private startTimer(): void {
    this.timerInterval = +setInterval((): void => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.timeLimit - this.timePassed;
      this.timerLabel.innerHTML = `${this.timeLeft}`;
      if (this.timeLeft === 0) {
        this.onTimesUp();
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
