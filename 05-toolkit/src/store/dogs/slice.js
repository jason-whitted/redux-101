import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import { loadBreeds } from './thunks';

const slice = createSlice({
  name: 'dogs',
  initialState,
  reducers: {
    setBreeds: (state, { payload }) => {
      state.breeds = payload;
    },
    setCurrentBreed: (state, { payload }) => {
      state.current = payload;
    },
  },
  extraReducers: {
    [loadBreeds.pending]: (state, { meta }) => {
      state.loading = true;
      state.error = undefined;
    },
    [loadBreeds.fulfilled]: (state, { payload, meta }) => {
      state.loading = false;
      state.breeds = payload;
    },
    [loadBreeds.rejected]: (state, { meta, error }) => {
      state.loading = false;
      state.error = error;
    },
  },
});

export default slice.reducer;

export const { setBreeds, setCurrentBreed } = slice.actions;
