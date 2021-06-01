import { createAsyncThunk } from '@reduxjs/toolkit';

export const loadBreeds = createAsyncThunk('loadBreeds', async (payload, { dispatch, getState }) => {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  const json = await response.json();
  const breeds = Object.entries(json.message).reduce(
    (arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)),
    []
  );
  return breeds;
});
