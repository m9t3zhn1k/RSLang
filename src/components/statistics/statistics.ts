import { BaseComponent } from '../base-component/base-component';
import './statistics.scss';

export class Statistics extends BaseComponent {
  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper']);
    const shortTermSection: HTMLElement = new BaseComponent(this.element, 'section', ['statistics__section', 'statistics__section_today']).element;
    const longTermSection: HTMLElement = new BaseComponent(this.element, 'section', ['statistics__section']).element;
    const shortTermContainer: HTMLElement = new BaseComponent(shortTermSection, 'div', ['container', 'statistics__container']).element;
    const longTermContainer: HTMLElement = new BaseComponent(longTermSection, 'div', ['container']).element;
    new BaseComponent(shortTermContainer, 'h2', ['statistics__title'], 'Статистика за сегодня');
    const shortTermWordsStatistics: HTMLElement = new BaseComponent(shortTermContainer, 'div', ['statistics__words-items']).element;
    const shortTermGamessStatistics: HTMLElement = new BaseComponent(shortTermContainer, 'div', ['statistics__games-items']).element;
    const shortTermPlayedWords: HTMLElement = new BaseComponent(shortTermWordsStatistics, 'div', ['statistics__words-item']).element;
    const shortTermLearntWords: HTMLElement = new BaseComponent(shortTermWordsStatistics, 'div', ['statistics__words-item']).element;
    const shortTermRightProcent: HTMLElement = new BaseComponent(shortTermWordsStatistics, 'div', ['statistics__words-item']).element;
    const shortTermGamesAudioChallenge: HTMLElement = new BaseComponent(shortTermGamessStatistics, 'div', ['statistics__games-item', 'shadow']).element;
    const shortTermGamesSprint: HTMLElement = new BaseComponent(shortTermGamessStatistics, 'div', ['statistics__games-item', 'shadow']).element;
    new BaseComponent(shortTermPlayedWords, 'span', ['statistics__words-item_value'], '0');
    new BaseComponent(shortTermPlayedWords, 'span', ['statistics__words-item_description'], 'слов сыграно');
    new BaseComponent(shortTermLearntWords, 'span', ['statistics__words-item_value'], '0');
    new BaseComponent(shortTermLearntWords, 'span', ['statistics__words-item_description'], 'слов изучено');
    new BaseComponent(shortTermRightProcent, 'span', ['statistics__words-item_value'], '0%');
    new BaseComponent(shortTermRightProcent, 'span', ['statistics__words-item_description'], 'правильных ответов');
    new BaseComponent(shortTermGamesAudioChallenge, 'p', ['statistics__games-item_title'], 'Аудиовызов');
    new BaseComponent(shortTermGamesAudioChallenge, 'p', [], 'Сыграно слов: 0');
    new BaseComponent(shortTermGamesAudioChallenge, 'p', [], 'Правильных ответов: 0%');
    new BaseComponent(shortTermGamesAudioChallenge, 'p', [], 'Самая длинная серия правильных ответов: 0');
    new BaseComponent(shortTermGamesSprint, 'p', ['statistics__games-item_title'], 'Спринт');
    new BaseComponent(shortTermGamesSprint, 'p', [], 'Сыграно 0 слов');
    new BaseComponent(shortTermGamesSprint, 'p', [], '0% правильных ответов');
    new BaseComponent(shortTermGamesSprint, 'p', [], 'Самая длинная серия правильных ответов: 0');
    //new BaseComponent(longTermContainer, 'h2', ['statistics__title'], 'Статистика за всё время');
  }
}
