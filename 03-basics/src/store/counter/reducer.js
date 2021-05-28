import * as CONST from './constants';
import initialState from './initialState';

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case CONST.COUNTER_DECREMENT:
      return {
        ...state,
        current: Math.max(state.min, state.current - 1),
      };
    case CONST.COUNTER_INCREMENT:
      return {
        ...state,
        current: Math.min(state.max, state.current + 1),
      };
    default:
      return state;
  }
};
