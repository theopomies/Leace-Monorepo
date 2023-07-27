export const setCacheId = (key: string, id: string) => {
  localStorage.setItem(key, JSON.stringify(id));
};

export const getCacheData = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
