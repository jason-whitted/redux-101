import * as CONST from './constants';
import initialState from './initialState';

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CONST.DOGS_SET_BREEDS:
      return {
        ...state,
        breeds: payload,
      };
    case CONST.DOGS_SET_CURRENT_BREED:
      return {
        ...state,
        current: payload,
      };
    default:
      return state;
  }
};
