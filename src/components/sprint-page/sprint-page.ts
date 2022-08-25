import { IBaseComponent } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import './sprint-page.scss';

export class SprintPage extends BaseComponent {
  public level: string | null = null;

  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper', 'wrapper__sprint-game']);
    const container: HTMLElement = new BaseComponent(this.element, 'div', ['container', 'game__container']).element;
    new BaseComponent(container, 'h2', ['game__title'], 'Спринт');
    const textContainer: HTMLElement = new BaseComponent(container, 'div', ['game__text']).element;
    new BaseComponent(textContainer, 'p', ['game__text_about'], `Игра на скорость, где требуется за 30 секунд перевести как можно большее количество слов и набрать максимальное количество баллов`);
    const rulesContainer: HTMLElement = new BaseComponent(textContainer, 'div', ['game__text_rules']).element;
    new BaseComponent(rulesContainer, 'p', ['game__text_key']).element.innerHTML = '&#129044;';
    new BaseComponent(rulesContainer, 'p', [], ' для выбора варианта ответа «Верно»');
    new BaseComponent(rulesContainer, 'p', ['game__text_key']).element.innerHTML = '&#129046;';
    new BaseComponent(rulesContainer, 'p', [], ' для выбора варианта ответа «Неверно»');
    new BaseComponent(container, 'h3', ['game__levels_title'], 'Уровень игры');
    const levelsContainer: HTMLElement = new BaseComponent(container, 'div', ['game__levels']).element;
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level: string): HTMLElement => new BaseComponent(levelsContainer, 'button', ['button', 'game__button_level'], level).element);
    const startGameButton: HTMLButtonElement = new BaseComponent(container, 'button', ['button', 'game__button_start'], 'Начать игру', { disabled: '' }).element as HTMLButtonElement;
    levels.forEach((level: HTMLElement) => level.addEventListener('click', () => {
      level.classList.toggle('checked');
      if (level.classList.contains('checked')) {
        this.level = level.textContent!;
        startGameButton.disabled = false;
      } else {
        this.level = null;
        startGameButton.disabled = true;
      }
      levels.forEach((button: HTMLElement): void => {
        if (button !== level) {
          button.classList.remove('checked');
        }
      });
    }));
    this.renderLights();
  }

  private renderLights(): void {
    new BaseComponent(this.element, 'div', ['light', 'x1']);
    new BaseComponent(this.element, 'div', ['light', 'x2']);
    new BaseComponent(this.element, 'div', ['light', 'x3']);
    new BaseComponent(this.element, 'div', ['light', 'x4']);
    new BaseComponent(this.element, 'div', ['light', 'x5']);
    new BaseComponent(this.element, 'div', ['light', 'x6']);
    new BaseComponent(this.element, 'div', ['light', 'x7']);
    new BaseComponent(this.element, 'div', ['light', 'x8']);
    new BaseComponent(this.element, 'div', ['light', 'x9']);
  }
}
