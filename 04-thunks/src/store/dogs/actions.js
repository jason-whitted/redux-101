import * as CONST from './constants';

export const setBreeds = (breeds) => ({
  type: CONST.DOGS_SET_BREEDS,
  payload: breeds,
});

export const setCurrentBreed = (breed) => ({
  type: CONST.DOGS_SET_CURRENT_BREED,
  payload: breed,
});
