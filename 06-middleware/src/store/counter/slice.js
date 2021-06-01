import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';

const slice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    incrementCounter: (state) => {
      state.current = Math.min(state.max, state.current + 1);
    },
    decrementCounter: (state) => {
      state.current = Math.max(state.min, state.current - 1);
    },
  },
});

export default slice.reducer;

export const { incrementCounter, decrementCounter } = slice.actions;
