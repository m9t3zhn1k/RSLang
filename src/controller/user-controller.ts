import { BASE_URL } from '../constants/constants';
import { IUser } from '../types/types';

export const getWords = async (): Promise<void> => {
  const rawResponse = await fetch(`${BASE_URL}/words?page=2&group=0`);
  const content = await rawResponse.json();
  return content;
};

export const createUser = async (user: IUser): Promise<void> => {
  const rawResponse = await fetch(`${BASE_URL}/users`, {
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
  const rawResponse = await fetch(`${BASE_URL}/users/${userId}/tokens`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  await rawResponse.json();
};
