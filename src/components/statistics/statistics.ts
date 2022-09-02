import { getAllUsersWords, getUserStatistic, putUserStatistic } from '../../controller/user-controller';
import { IStatistics, IUserWord, StatisticsData } from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import Loader from '../loader/loader';
import './statistics.scss';

export class Statistics extends BaseComponent {
  private loader: Loader;

  constructor(parent: HTMLElement) {
    /* putUserStatistic({
      optional: {
        date: new Date().toLocaleDateString(),
        sprint: { answers: 0, newWords: 'null', correctAnswers: 0, longestCorrectSeries: 0 },
        audioChallenge: { answers: 0, newWords: 'null', correctAnswers: 0, longestCorrectSeries: 0 },
      },
    }); */
    super(parent, 'div', ['wrapper']);
    this.loader = new Loader();
    this.loader.createLoader(document.body);
    this.getData().then((data: StatisticsData): void => {
      this.loader.destroy();
      this.renderResults(data);
    });
  }

  private async getData(): Promise<StatisticsData> {
    const statistics: IStatistics | void = await getUserStatistic();
    const userWords: IUserWord[] | null | void = await getAllUsersWords();
    return [statistics, userWords];
  }

  private async renderResults(data: StatisticsData): Promise<void> {
    const [statistics, userWords] = data;

    const shortTermSection: HTMLElement = new BaseComponent(this.element, 'section', [
      'statistics__section',
      'statistics__section_today',
    ]).element;
    //const longTermSection: HTMLElement = new BaseComponent(this.element, 'section', ['statistics__section']).element;
    const shortTermContainer: HTMLElement = new BaseComponent(shortTermSection, 'div', [
      'container',
      'statistics__container',
    ]).element;
    //const longTermContainer: HTMLElement = new BaseComponent(longTermSection, 'div', ['container']).element;
    new BaseComponent(shortTermContainer, 'h2', ['statistics__title'], 'Статистика за сегодня');
    const shortTermWordsStatistics: HTMLElement = new BaseComponent(shortTermContainer, 'div', [
      'statistics__words-items',
    ]).element;
    const shortTermGamessStatistics: HTMLElement = new BaseComponent(shortTermContainer, 'div', [
      'statistics__games-items',
    ]).element;
    const shortTermPlayedWords: HTMLElement = new BaseComponent(shortTermWordsStatistics, 'div', [
      'statistics__words-item',
    ]).element;
    const shortTermLearntWords: HTMLElement = new BaseComponent(shortTermWordsStatistics, 'div', [
      'statistics__words-item',
    ]).element;
    const shortTermRightProcent: HTMLElement = new BaseComponent(shortTermWordsStatistics, 'div', [
      'statistics__words-item',
    ]).element;
    const shortTermGamesAudioChallenge: HTMLElement = new BaseComponent(shortTermGamessStatistics, 'div', [
      'statistics__games-item',
      'shadow',
    ]).element;
    const shortTermGamesSprint: HTMLElement = new BaseComponent(shortTermGamessStatistics, 'div', [
      'statistics__games-item',
      'shadow',
    ]).element;
    const newAllWordsCounter: HTMLElement = new BaseComponent(shortTermPlayedWords, 'span', [
      'statistics__words-item_value',
    ]).element;
    new BaseComponent(shortTermPlayedWords, 'span', ['statistics__words-item_description'], 'новых слов');
    const learntAllWordsCounter: HTMLElement = new BaseComponent(shortTermLearntWords, 'span', [
      'statistics__words-item_value',
    ]).element;
    new BaseComponent(shortTermLearntWords, 'span', ['statistics__words-item_description'], 'слов изучено');
    const rightAnswersAllCounter: HTMLElement = new BaseComponent(shortTermRightProcent, 'span', [
      'statistics__words-item_value',
    ]).element;
    new BaseComponent(shortTermRightProcent, 'span', ['statistics__words-item_description'], 'правильных ответов');
    new BaseComponent(shortTermGamesAudioChallenge, 'p', ['statistics__games-item_title'], 'Аудиовызов');
    const newAudioChallengeWordsCounter: HTMLElement = new BaseComponent(shortTermGamesAudioChallenge, 'p', [])
      .element;
    const rightAnswersAudioChallengeCounter: HTMLElement = new BaseComponent(shortTermGamesAudioChallenge, 'p', [])
      .element;
    const longestSeriesAudioChallengeCounter: HTMLElement = new BaseComponent(shortTermGamesAudioChallenge, 'p', [])
      .element;
    new BaseComponent(shortTermGamesSprint, 'p', ['statistics__games-item_title'], 'Спринт');
    const newSprintWordsCounter: HTMLElement = new BaseComponent(shortTermGamesSprint, 'p', []).element;
    const rightAnswersSprintCounter: HTMLElement = new BaseComponent(shortTermGamesSprint, 'p', []).element;
    const longestSeriesSprintCounter: HTMLElement = new BaseComponent(shortTermGamesSprint, 'p', []).element;
    //new BaseComponent(longTermContainer, 'h2', ['statistics__title'], 'Статистика за всё время');

    if (statistics) {
      const newWordsSprint: string[] = statistics.optional.sprint.newWords === 'null' ? [] : statistics.optional.sprint.newWords.split(' ');
      const newWordsAudioChallenge: string[] = statistics.optional.audioChallenge.newWords === 'null' ? [] : statistics.optional.audioChallenge.newWords.split(' ');
      const newWords: string[] = [...new Set(new Array().concat(newWordsSprint, newWordsAudioChallenge))];
      newAllWordsCounter.textContent = 
        `${
          userWords?.filter(
            (word: IUserWord): boolean => word.optional.initDate === new Date().toLocaleDateString()
          ).length
        }` || '0';
      learntAllWordsCounter.textContent = 
        `${
          userWords?.filter(
            (word: IUserWord): boolean => word.optional.learntDate === new Date().toLocaleDateString()
          ).length
        }` || '0';
      const rightAnswersAllValue: number = Math.round(
        ((statistics.optional.audioChallenge.correctAnswers + statistics.optional.sprint.correctAnswers) /
          (statistics.optional.audioChallenge.answers + statistics.optional.sprint.answers)) *
          100
      );
      const rightAnswersSprintValue: number = Math.round(statistics.optional.sprint.correctAnswers / statistics.optional.sprint.answers * 100);
      const rightAnswersAudioChallengeValue: number = Math.round(statistics.optional.audioChallenge.correctAnswers / statistics.optional.audioChallenge.answers * 100);
      rightAnswersAllCounter.textContent = `${isNaN(rightAnswersAllValue) ? 0 : rightAnswersAllValue}%`;
      newSprintWordsCounter.textContent = `Новых слов: ${newWordsSprint.length}`;
      rightAnswersSprintCounter.textContent = isNaN(rightAnswersSprintValue) ? 'Правильных ответов: 0%' : `Правильных ответов: ${rightAnswersSprintValue}%`;
      longestSeriesSprintCounter.textContent = `Самая длинная серия правильных ответов: ${statistics.optional.sprint.longestCorrectSeries}`;
      newAudioChallengeWordsCounter.textContent = `Новых слов: ${newWordsAudioChallenge.length}`;
      rightAnswersAudioChallengeCounter.textContent = isNaN(rightAnswersAudioChallengeValue) ? 'Правильных ответов: 0%' : `Правильных ответов: ${rightAnswersAudioChallengeValue}%`;
      longestSeriesAudioChallengeCounter.textContent = `Самая длинная серия правильных ответов: ${statistics.optional.audioChallenge.longestCorrectSeries}`;
    }
  }
}
