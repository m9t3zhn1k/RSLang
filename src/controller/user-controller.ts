import { BASE_URL } from '../constants/constants';
import { IGetAllUsersWords, IUser, IUserWord, Optional, RequestBody } from '../types/types';

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

export const createUser: (user: IUser) => Promise<void> = async (user: IUser): Promise<void> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  await rawResponse.json();
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

export const getOneUserWord: (userId: string | null, wordId: string) => Promise<IUserWord | null> = async (
  userId: string | null,
  wordId: string
): Promise<IUserWord | null> => {
  const resp: Response = await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  return resp.ok ? resp.json() : null;
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

export const createUserWord: (userId: string, wordId: string, requestBody: RequestBody) => Promise<void> = async (
  userId: string,
  wordId: string,
  requestBody: RequestBody
): Promise<void> => {
  await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

export const addOptional: (type: 'dif' | 'learned', wordId: string) => Promise<void> = async (
  type: 'dif' | 'learned',
  wordId: string
): Promise<void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const userWordData = await getOneUserWord(userId, wordId);
  if (userWordData) {
    const requestBody: RequestBody = { optional: userWordData.optional };
    type === 'dif'
      ? (requestBody.optional.isDif = !requestBody.optional.isDif)
      : (requestBody.optional.isLearned = !requestBody.optional.isLearned);
    updateUserWord(userId, wordId, requestBody);
  } else {
    const requestBody: RequestBody =
      type === 'dif'
        ? { optional: { isDif: true, isLearned: false } }
        : { optional: { isDif: false, isLearned: true } };
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

export const addGameResults: (wordId: string, isCorrect: boolean) => Promise<void> = async (
  wordId: string,
  isCorrect: boolean
): Promise<void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const userWordData: IUserWord | null = await getOneUserWord(userId, wordId);
  const optional: Optional = userWordData?.optional ? userWordData.optional : { isDif: false, isLearned: false };
  if (isCorrect) {
    optional.correctAnswers = optional.correctAnswers ? (optional.correctAnswers += 1) : 1;
    optional.seriesOfCorrectAnswers = optional.seriesOfCorrectAnswers ? (optional.seriesOfCorrectAnswers += 1) : 1;
    if (
      (optional.isDif && optional.seriesOfCorrectAnswers >= 5) ||
      (!optional.isDif && optional.seriesOfCorrectAnswers >= 3)
    ) {
      optional.isLearned = true;
      optional.isDif = false;
    }
  } else {
    optional.incorrectAnswers = optional.incorrectAnswers ? (optional.incorrectAnswers += 1) : 1;
    optional.seriesOfCorrectAnswers = 0;
    if (optional.isLearned) {
      optional.isLearned = false;
    }
  }
  if (userWordData) {
    updateUserWord(userId, wordId, { optional });
  } else {
    createUserWord(userId, wordId, { optional });
  }
};
