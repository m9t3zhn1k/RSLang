import { getUserStatistic, putUserStatistic, resetGameStatistics } from '../../controller/statistics-controller';
import { getAllUsersWords, getUserId } from '../../controller/user-controller';
import {
  IStatistics,
  IUserWord,
  ShortTermStatisticsElements,
  StatisticsData,
  StatisticsDateObject,
  StatisticsDateValue,
} from '../../types/types';
import { BaseComponent } from '../base-component/base-component';
import Loader from '../loader/loader';
import './statistics.scss';
import Chart, { ChartItem } from 'chart.js/auto';

export class Statistics extends BaseComponent {
  private loader: Loader;

  constructor(parent: HTMLElement) {
    super(parent, 'div', ['wrapper']);
    this.loader = new Loader();
    this.loader.createLoader(document.body);
    if (!getUserId()) {
      new BaseComponent(
        this.element,
        'p',
        ['notification'],
        'Для сбора и просмотра статистики необходимо зарегистрироваться'
      );
      this.loader.destroy();
      return;
    }
    this.getData().then((data: StatisticsData): void => {
      this.loader.destroy();
      this.renderResults(data);
    });
  }

  private async getData(): Promise<StatisticsData> {
    let statistics: IStatistics | void = await getUserStatistic();
    if (statistics?.optional.date !== new Date().toLocaleDateString() && statistics) {
      statistics = resetGameStatistics(statistics);
      await putUserStatistic({ optional: statistics.optional });
    }
    const userWords: IUserWord[] | null | void = await getAllUsersWords();
    return [statistics, userWords];
  }

  private renderResults(data: StatisticsData): void {
    const [statistics, userWords] = data;
    if (statistics && userWords) {
      const shortTermStatisticsNodes: ShortTermStatisticsElements = this.renderShortTermStatistics();
      this.insertShortTermStatisticsValues(statistics, userWords, shortTermStatisticsNodes);
      this.renderLongTermStatistics(userWords);
    }
  }

  private renderLongTermStatistics(userWords: IUserWord[]): void {
    const longTermSection: HTMLElement = new BaseComponent(this.element, 'section', ['statistics__section']).element;
    const longTermContainer: HTMLElement = new BaseComponent(longTermSection, 'div', [
      'container',
      'statistics__container',
    ]).element;
    new BaseComponent(longTermContainer, 'h2', ['statistics__title'], 'Статистика за всё время');
    const graphicContainer: HTMLElement = new BaseComponent(longTermContainer, 'div', ['statistics__graphic-container'])
      .element;
    const newWords: StatisticsDateObject = userWords
      .filter((word: IUserWord): boolean => !!word.optional.initDate)
      .reduce((acc: StatisticsDateObject, item: IUserWord): StatisticsDateObject => {
        if (item.optional.initDate) {
          if (~Object.keys(acc).findIndex((key: string): boolean => key === item.optional.initDate)) {
            acc[item.optional.initDate] += 1;
          } else {
            acc[item.optional.initDate] = 1;
          }
        }
        return acc;
      }, {});
    const learntWords = Object.fromEntries(
      Object.entries(
        userWords
          .filter((word: IUserWord): boolean => !!word.optional.learntDate && word.optional.learntDate !== 'null')
          .reduce((acc: StatisticsDateObject, item): StatisticsDateObject => {
            if (item.optional.learntDate) {
              if (~Object.keys(acc).findIndex((key: string): boolean => key === item.optional.learntDate)) {
                acc[item.optional.learntDate] += 1;
              } else {
                acc[item.optional.learntDate] = 1;
              }
            }
            return acc;
          }, {})
      ).reduce((acc: StatisticsDateValue[], item: StatisticsDateValue, index: number): StatisticsDateValue[] => {
        if (!index) {
          acc.push([item[0], item[1]]);
        } else {
          acc.push([item[0], item[1] + acc[index - 1][1]]);
        }
        return acc;
      }, [])
    );
    const canvas: HTMLCanvasElement = new BaseComponent(graphicContainer, 'canvas', ['statistics__graphic'])
      .element as HTMLCanvasElement;
    const ctx: ChartItem = canvas.getContext('2d') as ChartItem;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(newWords),
        datasets: [
          {
            label: 'Количество новых слов за каждый день изучения',
            data: Object.values(newWords),
            backgroundColor: '#02bfdf',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    const canvas2: HTMLCanvasElement = new BaseComponent(graphicContainer, 'canvas', ['statistics__graphic'])
      .element as HTMLCanvasElement;
    const ctx2: ChartItem = canvas2.getContext('2d') as ChartItem;
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: Object.keys(learntWords),
        datasets: [
          {
            label: 'Увеличение общего количества изученных слов за весь период обучения по дням',
            data: Object.values(learntWords),
            backgroundColor: '#02bfdf',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  private renderShortTermStatistics(): ShortTermStatisticsElements {
    const shortTermSection: HTMLElement = new BaseComponent(this.element, 'section', [
      'statistics__section',
      'statistics__section_today',
    ]).element;
    const shortTermContainer: HTMLElement = new BaseComponent(shortTermSection, 'div', [
      'container',
      'statistics__container',
    ]).element;
    new BaseComponent(shortTermContainer, 'h2', ['statistics__title'], 'Статистика за сегодня');
    const shortTermWordsStatistics: HTMLElement = new BaseComponent(shortTermContainer, 'div', [
      'statistics__words-items',
    ]).element;
    const shortTermGamesStatistics: HTMLElement = new BaseComponent(shortTermContainer, 'div', [
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
    const shortTermGamesAudioChallenge: HTMLElement = new BaseComponent(shortTermGamesStatistics, 'div', [
      'statistics__games-item',
      'shadow',
    ]).element;
    const shortTermGamesSprint: HTMLElement = new BaseComponent(shortTermGamesStatistics, 'div', [
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
    const newAudioChallengeWordsCounter: HTMLElement = new BaseComponent(shortTermGamesAudioChallenge, 'p').element;
    const rightAnswersAudioChallengeCounter: HTMLElement = new BaseComponent(shortTermGamesAudioChallenge, 'p').element;
    const longestSeriesAudioChallengeCounter: HTMLElement = new BaseComponent(shortTermGamesAudioChallenge, 'p')
      .element;
    new BaseComponent(shortTermGamesSprint, 'p', ['statistics__games-item_title'], 'Спринт');
    const newSprintWordsCounter: HTMLElement = new BaseComponent(shortTermGamesSprint, 'p').element;
    const rightAnswersSprintCounter: HTMLElement = new BaseComponent(shortTermGamesSprint, 'p').element;
    const longestSeriesSprintCounter: HTMLElement = new BaseComponent(shortTermGamesSprint, 'p').element;
    return {
      newAllWordsCounter,
      learntAllWordsCounter,
      rightAnswersAllCounter,
      newAudioChallengeWordsCounter,
      rightAnswersAudioChallengeCounter,
      longestSeriesAudioChallengeCounter,
      newSprintWordsCounter,
      rightAnswersSprintCounter,
      longestSeriesSprintCounter,
    };
  }

  private insertShortTermStatisticsValues(
    statistics: IStatistics,
    userWords: IUserWord[],
    elements: ShortTermStatisticsElements
  ): void {
    const {
      newAllWordsCounter,
      learntAllWordsCounter,
      rightAnswersAllCounter,
      newAudioChallengeWordsCounter,
      rightAnswersAudioChallengeCounter,
      longestSeriesAudioChallengeCounter,
      newSprintWordsCounter,
      rightAnswersSprintCounter,
      longestSeriesSprintCounter,
    } = elements;
    const newWordsSprint: string[] =
      statistics.optional.sprint.newWords === 'null' ? [] : statistics.optional.sprint.newWords.split(' ');
    const newWordsAudioChallenge: string[] =
      statistics.optional.audioChallenge.newWords === 'null'
        ? []
        : statistics.optional.audioChallenge.newWords.split(' ');
    newAllWordsCounter.textContent =
      `${
        userWords?.filter((word: IUserWord): boolean => word.optional.initDate === new Date().toLocaleDateString())
          .length
      }` || '0';
    learntAllWordsCounter.textContent =
      `${
        userWords?.filter((word: IUserWord): boolean => word.optional.learntDate === new Date().toLocaleDateString())
          .length
      }` || '0';
    const rightAnswersAllValue: number = Math.round(
      ((statistics.optional.audioChallenge.correctAnswers + statistics.optional.sprint.correctAnswers) /
        (statistics.optional.audioChallenge.answers + statistics.optional.sprint.answers)) *
        100
    );
    const rightAnswersSprintValue: number = Math.round(
      (statistics.optional.sprint.correctAnswers / statistics.optional.sprint.answers) * 100
    );
    const rightAnswersAudioChallengeValue: number = Math.round(
      (statistics.optional.audioChallenge.correctAnswers / statistics.optional.audioChallenge.answers) * 100
    );
    rightAnswersAllCounter.textContent = `${isNaN(rightAnswersAllValue) ? 0 : rightAnswersAllValue}%`;
    newSprintWordsCounter.textContent = `Новых слов: ${newWordsSprint.length}`;
    rightAnswersSprintCounter.textContent = isNaN(rightAnswersSprintValue)
      ? 'Правильных ответов: 0%'
      : `Правильных ответов: ${rightAnswersSprintValue}%`;
    longestSeriesSprintCounter.textContent = `Самая длинная серия правильных ответов: ${statistics.optional.sprint.longestCorrectSeries}`;
    newAudioChallengeWordsCounter.textContent = `Новых слов: ${newWordsAudioChallenge.length}`;
    rightAnswersAudioChallengeCounter.textContent = isNaN(rightAnswersAudioChallengeValue)
      ? 'Правильных ответов: 0%'
      : `Правильных ответов: ${rightAnswersAudioChallengeValue}%`;
    longestSeriesAudioChallengeCounter.textContent = `Самая длинная серия правильных ответов: ${statistics.optional.audioChallenge.longestCorrectSeries}`;
  }
}
