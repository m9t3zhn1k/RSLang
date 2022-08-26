export class BaseComponentInnerHTML {
  public element: HTMLElement;

  constructor(parent: HTMLElement, content: string = '') {
    this.element = document.createElement('div');
    parent.append(this.element);
    this.element.innerHTML = content;
  }

  public remove(): void {
    this.element.remove();
  }
}
