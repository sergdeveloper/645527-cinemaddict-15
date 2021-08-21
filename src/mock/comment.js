import { getRandomInteger } from './movie';

const generateComment = () => {
  return {
    "id": getRandomInteger (1, 5),
    "author": "Ilya O'Reilly",
    "comment": "a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.",
    "date": "2019-05-11T16:12:32.554Z",
    "emotion": "smile",
  };
};

export const generateComments = () => {
  return new Array(getRandomInteger(1, 5)).fill().map(generateComment);
};