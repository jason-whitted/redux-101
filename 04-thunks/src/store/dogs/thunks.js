import * as CONST from './constants';

export const loadBreeds = (arg) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONST.DOGS_LOAD_BREEDS_PENDING,
      meta: { arg },
    });

    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const json = await response.json();
    const breeds = Object.entries(json.message).reduce(
      (arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)),
      []
    );

    dispatch({
      type: CONST.DOGS_LOAD_BREEDS_FULFILLED,
      meta: { arg },
      payload: breeds,
    });
  } catch (error) {
    dispatch({
      type: CONST.DOGS_LOAD_BREEDS_REJECTED,
      meta: { arg },
      error,
    });
  }
};
