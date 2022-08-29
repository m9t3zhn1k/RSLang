export const addLastPageInLocalStorage = (pageType: string): void => {
  window.localStorage.setItem('lastPageType', pageType);
};

export const getLastPageFromLocalStorage = (): null | string => {
  return window.localStorage.getItem('lastPageType');
};
