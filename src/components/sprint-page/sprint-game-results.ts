import { BaseComponent } from '../base-component/base-component';

export class SprintResultPage {
  constructor(private parent: HTMLElement) {
    this.renderResults();
  }

  private renderResults(): void {
    while (this.parent.firstChild) {
      this.parent.removeChild(this.parent.firstChild);
    }
    new BaseComponent(this.parent, 'div', [], 'RESULTS');
  }
}
