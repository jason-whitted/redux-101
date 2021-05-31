import { createSelector } from '@reduxjs/toolkit';

export const selectDogs = (state) => state.dogs;
export const selectCurrentBreed = createSelector(selectDogs, ({ current }) => current);
