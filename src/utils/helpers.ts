export const removeSpaces = (str: string): string => str.replace(/\s+/g, '');

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
