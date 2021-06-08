import { createSlice } from '@reduxjs/toolkit';
import initialState from './initialState';
import * as reducers from './reducers';

const slice = createSlice({
  name: 'counter',
  initialState,
  reducers,
});

export default slice.reducer;

export const { incrementCounter, decrementCounter } = slice.actions;
