import * as CONST from './constants';
import initialState from './initialState';

export default (state = initialState, { type, payload, meta, error }) => {
  switch (type) {
    case CONST.DOGS_LOAD_BREEDS_PENDING:
      return {
        ...state,
        loading: true,
        error: undefined,
      };
    case CONST.DOGS_LOAD_BREEDS_FULFILLED:
      return {
        ...state,
        loading: false,
        breeds: payload,
      };
    case CONST.DOGS_LOAD_BREEDS_REJECTED:
      return {
        ...state,
        loading: true,
        error,
      };
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
