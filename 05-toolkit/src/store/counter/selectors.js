import { createSelector } from '@reduxjs/toolkit';

export const selectCounter = (state) => state.counter;
export const selectCurrentCounter = createSelector(selectCounter, ({ current }) => current);
