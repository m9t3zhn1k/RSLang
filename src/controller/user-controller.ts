import { BASE_URL } from '../constants/constants';
import {
  IAggregatedResponse,
  IGetAllUsersWords,
  IResponseWord,
  IStatistics,
  IUser,
  IUserWord,
  IWord,
  Optional,
  RequestBody,
  WordResult,
} from '../types/types';

export const getToken: () => string | null = (): string | null => {
  if (window.localStorage.getItem('rslang-team58-user')) {
    return JSON.parse(window.localStorage.getItem('rslang-team58-user') ?? ' ').token;
  } else {
    return null;
  }
};

export const getUserId: () => string | null = (): string | null => {
  if (window.localStorage.getItem('rslang-team58-user')) {
    return JSON.parse(window.localStorage.getItem('rslang-team58-user') ?? ' ').userId;
  } else {
    return null;
  }
};

export const createUser: (user: IUser) => Promise<Response> = async (user: IUser): Promise<Response> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  await rawResponse.json();

  return rawResponse;
};

export const loginUser: (user: IUser) => Promise<Response> = async (user: IUser): Promise<Response> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  return rawResponse;
};

export const getUser: (userId: string, token: string) => Promise<void> = async (
  userId: string,
  token: string
): Promise<void> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await rawResponse.json();
};

export const createToken: (userId: string, refreshToken: string) => Promise<void> = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/users/${userId}/tokens`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  await rawResponse.json();
};

export const getOneUserWord: (wordId: string) => Promise<IUserWord | null> = async (
  wordId: string
): Promise<IUserWord | null> => {
  const resp: Response = await fetch(`${BASE_URL}/users/${getUserId()}/words/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  return resp.ok ? resp.json() : null;
};

export const getUserAgrWord: (wordId: string) => Promise<IWord> = async (wordId: string): Promise<IWord> => {
  const resp: Response = await fetch(`${BASE_URL}/users/${getUserId()}/aggregatedWords/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  return resp.json().then((item: IWord[]): IWord => item[0]);
};

export const getUserAgrWords: (group: number, page: number) => Promise<IWord[]> = async (
  group: number,
  page: number
): Promise<IWord[]> => {
  const resp: Response = await fetch(
    `${BASE_URL}/users/${getUserId()}/aggregatedWords?group=${group}&wordsPerPage=600&filter={"page":${page}}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: 'application/json',
      },
    }
  );
  return resp.json().then((item: IAggregatedResponse[]): IWord[] =>
    item[0].paginatedResults.map(
      (i: IResponseWord): IWord => ({
        ...i,
        id: i._id,
        image: `${BASE_URL}/${i.image}`,
        audio: `${BASE_URL}/${i.audio}`,
        audioMeaning: `${BASE_URL}/${i.audioMeaning}`,
        audioExample: `${BASE_URL}/${i.audioExample}`,
      })
    )
  );
};

export const getUserAgrGameWords: (group: number) => Promise<IWord[]> = async (group: number): Promise<IWord[]> => {
  const resp: Response = await fetch(
    `${BASE_URL}/users/${getUserId()}/aggregatedWords?group=${group}&wordsPerPage=600`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${getToken()}`,
        Accept: 'application/json',
      },
    }
  );
  return resp.json().then((item: IAggregatedResponse[]): IWord[] =>
    item[0].paginatedResults.map(
      (i: IResponseWord): IWord => ({
        ...i,
        id: i._id,
        image: `${BASE_URL}/${i.image}`,
        audio: `${BASE_URL}/${i.audio}`,
        audioMeaning: `${BASE_URL}/${i.audioMeaning}`,
        audioExample: `${BASE_URL}/${i.audioExample}`,
      })
    )
  );
};

export const updateUserWord: (userId: string, wordId: string, requestBody: RequestBody) => Promise<void> = async (
  userId: string,
  wordId: string,
  requestBody: RequestBody
): Promise<void> => {
  await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

export const createUserWord = async (userId: string, wordId: string, requestBody: RequestBody): Promise<void> => {
  await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

export const addOptional = async (type: 'dif' | 'learned', wordId: string): Promise<void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const userWordData: IUserWord | null = await getOneUserWord(wordId);
  if (userWordData) {
    const requestBody: RequestBody = { optional: userWordData.optional };
    type === 'dif'
      ? (requestBody.optional.isDif = !requestBody.optional.isDif)
      : (requestBody.optional.isLearned = !requestBody.optional.isLearned);
    requestBody.optional.learntDate = requestBody.optional.isLearned ? new Date().toLocaleDateString() : 'null';
    updateUserWord(userId, wordId, requestBody);
  } else {
    const requestBody: RequestBody =
      type === 'dif'
        ? { optional: { isDif: true, isLearned: false } }
        : { optional: { isDif: false, isLearned: true } };
    requestBody.optional.learntDate = requestBody.optional.isLearned ? new Date().toLocaleDateString() : 'null';
    requestBody.optional.initDate = new Date().toLocaleDateString();
    createUserWord(userId, wordId, requestBody);
  }
};

export const getAllUsersWords: IGetAllUsersWords = async (): Promise<IUserWord[] | null | void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const resp: Response = await fetch(`${BASE_URL}/users/${userId}/words`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  return resp.ok ? resp.json() : null;
};

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

export const addGameResults: (wordId: string, isCorrect: boolean) => Promise<void> = async (
  wordId: string,
  isCorrect: boolean
): Promise<void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const userWordData: IWord = await getUserAgrWord(wordId);
  const optional: Optional = userWordData.userWord?.optional
    ? userWordData.userWord.optional
    : { isDif: false, isLearned: false };
  if (isCorrect) {
    optional.correctAnswers = optional.correctAnswers ? (optional.correctAnswers += 1) : 1;
    optional.seriesOfCorrectAnswers = optional.seriesOfCorrectAnswers ? (optional.seriesOfCorrectAnswers += 1) : 1;
    optional.incorrectAnswers = optional.incorrectAnswers ?? 0;
    if (
      (optional.isDif && optional.seriesOfCorrectAnswers >= 5) ||
      (!optional.isDif && optional.seriesOfCorrectAnswers >= 3)
    ) {
      optional.isLearned = true;
      optional.isDif = false;
    }
  } else {
    optional.correctAnswers = optional.correctAnswers ?? 0;
    optional.incorrectAnswers = optional.incorrectAnswers ? (optional.incorrectAnswers += 1) : 1;
    optional.seriesOfCorrectAnswers = 0;
    if (optional.isLearned) {
      optional.isLearned = false;
    }
  }
  if (userWordData.userWord?.optional) {
    updateUserWord(userId, wordId, { optional });
  } else {
    optional.initDate = new Date().toLocaleDateString();
    createUserWord(userId, wordId, { optional });
  }
};

export const updateGameStatistics = async (
  gameResults: WordResult[],
  longestSeries: number,
  game: 'sprint' | 'audioChallenge'
): Promise<void> => {
  const userStatistics: IStatistics | void = await getUserStatistic();
  if (userStatistics) {
    if (userStatistics.optional.date !== new Date().toLocaleDateString()) {
      userStatistics.optional.date = new Date().toLocaleDateString();
      userStatistics.optional.sprint.correctAnswers = 0;
      userStatistics.optional.sprint.answers = 0;
      userStatistics.optional.sprint.longestCorrectSeries = 0;
      userStatistics.optional.sprint.newWords = 'null';
      userStatistics.optional.audioChallenge.correctAnswers = 0;
      userStatistics.optional.audioChallenge.answers = 0;
      userStatistics.optional.audioChallenge.longestCorrectSeries = 0;
      userStatistics.optional.audioChallenge.newWords = 'null';
    }
    if (userStatistics.optional[game].longestCorrectSeries < longestSeries) {
      userStatistics.optional[game].longestCorrectSeries = longestSeries;
    }
    userStatistics.optional[game].answers += gameResults.length;
    if (userStatistics.optional[game].newWords === 'null') {
      userStatistics.optional[game].newWords = '';
    }
    gameResults.forEach((word: WordResult): void => {
      if (word.result) {
        userStatistics.optional[game].correctAnswers += 1;
      }
      if (word.initDate === new Date().toLocaleDateString() && !~userStatistics.optional[game].newWords.indexOf(word.word.word)) {
        userStatistics.optional[game].newWords += ` ${word.word.word}`;
      }
    });
    if (!userStatistics.optional[game].newWords) {
      userStatistics.optional[game].newWords = 'null';
    }
    await putUserStatistic({ optional: userStatistics.optional });
  }
};
