import { BASE_URL } from '../constants/constants';
import { IUser, IWord, IUserWord, IQueryParam, RequestBody } from '../types/types';

export const getToken = (): string | null => {
  if (window.localStorage.getItem('rslang-team58-user')) {
    return JSON.parse(window.localStorage.getItem('rslang-team58-user') ?? ' ').token
  } else {
    return null
  }
}

export const getUserId = (): string | null => {
  if (window.localStorage.getItem('rslang-team58-user')) {
    return JSON.parse(window.localStorage.getItem('rslang-team58-user') ?? ' ').userId
  } else {
    return null
  }
}

export const createUser = async (user: IUser): Promise<void> => {
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

export const loginUser = async (user: IUser): Promise<Response> => {
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

export const getUser = async (userId: string, token: string): Promise<void> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  await rawResponse.json();
};

export const createToken = async (userId: string, refreshToken: string): Promise<void> => {
  const rawResponse: Response = await fetch(`${BASE_URL}/users/${userId}/tokens`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  await rawResponse.json();
};


const generateQueryString: (queryParams?: IQueryParam[]) => string = (queryParams: IQueryParam[] = []): string =>
    queryParams.length ? `?${queryParams.map((x): string => `${x.key}=${x.value}`).join('&')}` : '';

export const getOneUserWord: (userId: string | null, wordId: string) => Promise<IUserWord | null> = async (userId: string | null, wordId: string): Promise<IUserWord | null> => {
    const resp: Response = await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json',
        }
    });
    return resp.ok 
        ? await resp.json()
        : null;
}

export const updateUserWord = async (userId: string, wordId: string, requestBody: RequestBody) => {
    await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
    });
}

export const createUserWord = async (userId: string, wordId: string, requestBody: RequestBody) => {
    await fetch(`${BASE_URL}/users/${userId}/words/${wordId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
    });
}

export const addOptional = async (type: 'dif' | 'learned', wordId: string) => {
    const userId: string | null = getUserId();
    if (!userId) {
      return
    }
    const userWordData = await getOneUserWord(userId, wordId);
    if (userWordData) {
        const requestBody: RequestBody =  {'optional': userWordData.optional};
        type === 'dif'
            ? requestBody.optional.isDif = !requestBody.optional.isDif
            : requestBody.optional.isLearned = !requestBody.optional.isLearned;
        updateUserWord(userId, wordId, requestBody);
    } else {
        const requestBody: RequestBody =  type === 'dif' 
            ? {"optional": {
                "isDif": true,
                "isLearned": false
              }}
            : {"optional": {
                "isDif": false,
                "isLearned": true
            }};
        createUserWord(userId, wordId, requestBody);
    }
}

export const getAllUsersWords: () => Promise<IUserWord[] | null | void> = async ():Promise<IUserWord[] | null | void> => {
    const userId: string | null = getUserId();
    if (!userId) {
      return
    };
    const resp: Response = await fetch(`${BASE_URL}/users/${userId}/words`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Accept': 'application/json',
        }
    });
    return resp.ok ? resp.json() : null;
}

