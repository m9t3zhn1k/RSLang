import { BASE_URL } from '../constants/constants';
import {
  IAggregatedResponse,
  IGetAllUsersWords,
  IResponseWord,
  IUser,
  IUserWord,
  IWord,
  Optional,
  RequestBody,
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
  const url: string =
    group === 6
      ? `${BASE_URL}/users/${getUserId()}/aggregatedWords?wordsPerPage=3600&filter=%7B%22userWord.optional.isDif%22%3A%20true%7D`
      : `${BASE_URL}/users/${getUserId()}/aggregatedWords?group=${group}&wordsPerPage=600`;
  const resp: Response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });

  return resp.json().then((item: IAggregatedResponse[]): IWord[] =>
    item[0].paginatedResults.map(
      (i: IResponseWord): IWord => ({
        ...i,
        id: i._id,
        image: `${BASE_URL}/${i.image}`,
        audio: `${BASE_URL}/${i.audio}`,
        audioMeaning: `${BASE_URL}/${i.audioMeaning}`,
        audioExample: `${BASE_URL}/${i.audioExample}`,
        page: group === 6 ? 0 : i.page,
      })
    )
  );
};

export const updateUserWord: (
  userId: string,
  wordId: string,
  requestBody: RequestBody
) => Promise<IUserWord | void> = async (
  userId: string,
  wordId: string,
  requestBody: RequestBody
): Promise<IUserWord | void> => {
  const res = await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  return res.ok ? res.json() : undefined;
};

export const createUserWord: (
  userId: string,
  wordId: string,
  requestBody: RequestBody
) => Promise<IUserWord | void> = async (
  userId: string,
  wordId: string,
  requestBody: RequestBody
): Promise<IUserWord | void> => {
  const res = await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  return res.ok ? res.json() : undefined;
};

export const addOptional: (type: 'dif' | 'learned', wordId: string) => Promise<void> = async (
  type: 'dif' | 'learned',
  wordId: string
): Promise<void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const userWordData: IWord | null = await getUserAgrWord(wordId);
  if (userWordData.userWord?.optional) {
    let requestBody: RequestBody = { optional: { isDif: false, isLearned: false } };
    if (userWordData.userWord?.optional) {
      requestBody = { optional: userWordData.userWord?.optional };
    }
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

export const addGameResults: (wordId: string, isCorrect: boolean) => Promise<IUserWord | void> = async (
  wordId: string,
  isCorrect: boolean
): Promise<IUserWord | void> => {
  const userId: string | null = getUserId();
  if (!userId) {
    return;
  }
  const userWordData: IWord | void = await getUserAgrWord(wordId);
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
  if (userWordData.userWord?.optional.initDate) {
    return updateUserWord(userId, wordId, { optional });
  } else {
    optional.initDate = new Date().toLocaleDateString();
    return createUserWord(userId, wordId, { optional });
  }
};
