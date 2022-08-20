import { IBaseComponent } from '../../types/types';

export class BaseComponent implements IBaseComponent {
  public element: HTMLElement;

  constructor(
    parent: HTMLElement,
    tag: keyof HTMLElementTagNameMap = 'div',
    classList: string[] = [],
    content: string = '',
    attributes: { [key: string]: string } = {}
  ) {
    this.element = document.createElement(tag);
    parent.append(this.element);
    if (classList.length) {
      this.element.classList.add(...classList);
    }
    if (Object.entries(attributes).length) {
      Object.entries(attributes).forEach(([attr, value]: string[]): void => this.element.setAttribute(attr, value));
    }
    this.element.textContent = content;
  }

  public remove(): void {
    this.element.remove();
  }
}
