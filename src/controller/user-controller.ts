import { BASE_URL } from '../constants/constants';
import {
  IAggregatedResponse,
  IGetAllUsersWords,
  IResponseWord,
  IUser,
  IUserWord,
  IWord,
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

export const getUserAgrWord = async (wordId: string): Promise<IUserWord[]> => {
  const resp: Response = await fetch(`${BASE_URL}/users/${getUserId()}/aggregatedWords/${wordId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: 'application/json',
    },
  });
  return resp.json().then((item): IUserWord[] =>
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

export const getUserAgrWords = async (group: number, page: number): Promise<IWord[]> => {
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

export const getUserAgrGameWords = async (group: number): Promise<IWord[]> => {
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

export const getHardUserWords = async (): Promise<IWord[]> => {
  const resp: Response = await fetch(
    `${BASE_URL}/users/${getUserId()}/aggregatedWords?wordsPerPage=3600&filter={"userWord.optional.isDif":"true"}`,
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

export const updateUserWord = async (userId: string, wordId: string, requestBody: RequestBody): Promise<void> => {
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
  const userWordData = await getOneUserWord(wordId);
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
