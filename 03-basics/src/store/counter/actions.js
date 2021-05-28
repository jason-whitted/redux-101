import * as CONST from './constants';

export const incrementCounter = () => ({ type: CONST.COUNTER_INCREMENT });
export const decrementCounter = () => ({ type: CONST.COUNTER_DECREMENT });
