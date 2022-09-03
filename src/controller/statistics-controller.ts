import { BASE_URL } from '../constants/constants';
import { IStatistics, WordResultSynch } from '../types/types';
import { getToken, getUserId } from './user-controller';

export const getUserStatistic: () => Promise<IStatistics | void> = async (): Promise<IStatistics | void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const resp: Response = await fetch(`${BASE_URL}/users/${userId}/statistics`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  return resp.ok ? resp.json() : null;
};

export const putUserStatistic: (statistics: IStatistics) => Promise<void> = async (
  statistics: IStatistics
): Promise<void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  await fetch(`${BASE_URL}/users/${userId}/statistics`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statistics),
  });
};

const resetGameStatistics: (statistics: IStatistics) => IStatistics = (statistics: IStatistics): IStatistics => {
  statistics.optional.date = new Date().toLocaleDateString();
  statistics.optional.sprint.correctAnswers = 0;
  statistics.optional.sprint.answers = 0;
  statistics.optional.sprint.longestCorrectSeries = 0;
  statistics.optional.sprint.newWords = 'null';
  statistics.optional.audioChallenge.correctAnswers = 0;
  statistics.optional.audioChallenge.answers = 0;
  statistics.optional.audioChallenge.longestCorrectSeries = 0;
  statistics.optional.audioChallenge.newWords = 'null';
  return statistics;
};

export const updateGameStatistics = async (
  gameResults: (WordResultSynch | undefined)[],
  longestSeries: number,
  game: 'sprint' | 'audioChallenge'
): Promise<void> => {
  let userStatistics: IStatistics | void = await getUserStatistic();
  if (userStatistics) {
    if (userStatistics.optional.date !== new Date().toLocaleDateString()) {
      userStatistics = resetGameStatistics(userStatistics);
    }
    if (userStatistics.optional[game].longestCorrectSeries < longestSeries) {
      userStatistics.optional[game].longestCorrectSeries = longestSeries;
    }
    userStatistics.optional[game].answers += gameResults.length;
    if (userStatistics.optional[game].newWords === 'null') {
      userStatistics.optional[game].newWords = '';
    }
    gameResults.forEach((word: WordResultSynch | undefined): void => {
      if (!word) {
        return;
      }
      if (userStatistics) {
        if (word.result) {
          userStatistics.optional[game].correctAnswers += 1;
        }
        if (
          word.word.optional.initDate === new Date().toLocaleDateString() &&
          !~userStatistics.optional.newWords.indexOf(word.word.id)
        ) {
          userStatistics.optional[game].newWords += ` ${word.word.id}`;
          userStatistics.optional.newWords += ` ${word.word.id}`;
        }
      }
    });
    if (!userStatistics.optional[game].newWords) {
      userStatistics.optional[game].newWords = 'null';
    }
    userStatistics.optional[game].newWords = userStatistics.optional[game].newWords.trim();
    userStatistics.optional.newWords = userStatistics.optional.newWords.trim();
    await putUserStatistic({ optional: userStatistics.optional });
  }
};
