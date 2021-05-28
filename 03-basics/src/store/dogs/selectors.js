import { createSelector } from 'reselect';

export const selectDogs = (state) => state.dogs;
export const selectCurrentBreed = createSelector(selectDogs, ({ current }) => current);
