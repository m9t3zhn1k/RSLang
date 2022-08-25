import { BASE_URL } from "../constants/constants";
import { IQueryParam, IWord } from "../types/types";


const generateQueryString: (queryParams?: IQueryParam[]) => string = (queryParams: IQueryParam[] = []): string =>
    queryParams.length ? `?${queryParams.map((x): string => `${x.key}=${x.value}`).join('&')}` : '';

export const getWords = async (section: number, page: number) => {
    const resp: Response = await fetch(`${BASE_URL}/words${generateQueryString([{key: 'group', value: `${section}`}, {key: 'page', value: `${page}`}])}`);
    const wordsArr: IWord[] = await resp.json();
    wordsArr.forEach((wordData: IWord): void => {
        wordData.image = `${BASE_URL}/${wordData.image}`;
        wordData.audio = `${BASE_URL}/${wordData.audio}`;
        wordData.audioMeaning = `${BASE_URL}/${wordData.audioMeaning}`;
        wordData.audioExample = `${BASE_URL}/${wordData.audioExample}`;

    });
    return wordsArr
}

export const getOneWord = async (wordId: string): Promise<IWord> => {
    const resp: Response = await fetch(`${BASE_URL}/words/${wordId}`);
    const wordData: IWord = await resp.json();
    wordData.image = `${BASE_URL}/${wordData.image}`;
    wordData.audio = `${BASE_URL}/${wordData.audio}`;
    wordData.audioMeaning = `${BASE_URL}/${wordData.audioMeaning}`;
    wordData.audioExample = `${BASE_URL}/${wordData.audioExample}`;
    return wordData;
}