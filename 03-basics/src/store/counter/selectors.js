import { createSelector } from 'reselect';

export const selectCounter = (state) => state.counter;
export const selectCurrentCounter = createSelector(selectCounter, ({ current }) => current);
