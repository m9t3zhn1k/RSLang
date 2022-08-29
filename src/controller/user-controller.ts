import { BASE_URL } from '../constants/constants';
<<<<<<< HEAD
<<<<<<< HEAD
import { IGetAllUsersWords, IUser, IUserWord, RequestBody } from '../types/types';

export const getToken: () => string | null = (): string | null => {
=======
import { IUser, IUserWord, RequestBody } from '../types/types';

export const getToken = (): string | null => {
>>>>>>> f32c805 (refactor: deviding sprint-game into three files for each stage)
  if (window.localStorage.getItem('rslang-team58-user')) {
    return JSON.parse(window.localStorage.getItem('rslang-team58-user') ?? ' ').token;
  } else {
    return null;
  }
};
<<<<<<< HEAD
=======
import { IUser } from '../types/types';
>>>>>>> b3e3e7e (feat: add init page of sprint game)
=======

export const getUserId = (): string | null => {
  if (window.localStorage.getItem('rslang-team58-user')) {
    return JSON.parse(window.localStorage.getItem('rslang-team58-user') ?? ' ').userId;
  } else {
    return null;
  }
};
>>>>>>> f32c805 (refactor: deviding sprint-game into three files for each stage)

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

<<<<<<< HEAD
export const updateUserWord: (userId: string, wordId: string, requestBody: RequestBody) => Promise<void> = async (
  userId: string,
  wordId: string,
  requestBody: RequestBody
): Promise<void> => {
=======
export const updateUserWord = async (userId: string, wordId: string, requestBody: RequestBody): Promise<void> => {
>>>>>>> f32c805 (refactor: deviding sprint-game into three files for each stage)
  await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

<<<<<<< HEAD
export const createUserWord: (userId: string, wordId: string, requestBody: RequestBody) => Promise<void> = async (
  userId: string,
  wordId: string,
  requestBody: RequestBody
): Promise<void> => {
=======
export const createUserWord = async (userId: string, wordId: string, requestBody: RequestBody): Promise<void> => {
>>>>>>> f32c805 (refactor: deviding sprint-game into three files for each stage)
  await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
};

<<<<<<< HEAD
export const addOptional: (type: 'dif' | 'learned', wordId: string) => Promise<void> = async (
  type: 'dif' | 'learned',
  wordId: string
): Promise<void> => {
=======
export const addOptional = async (type: 'dif' | 'learned', wordId: string): Promise<void> => {
>>>>>>> f32c805 (refactor: deviding sprint-game into three files for each stage)
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

<<<<<<< HEAD
export const getAllUsersWords: IGetAllUsersWords = async (): Promise<IUserWord[] | null | void> => {
=======
export const getAllUsersWords = async (): Promise<IUserWord[] | null | void> => {
>>>>>>> f32c805 (refactor: deviding sprint-game into three files for each stage)
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
