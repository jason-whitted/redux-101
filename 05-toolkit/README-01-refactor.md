# Redux Toolkit

That was a lot to process.  Redux receives some criticism for a few reasons:
- Seemingly excessive boilerplate code: constants, reducer, action creators, thunks, selectors.
- Confusing configuration: `createStore`, `combineReducers`, `applyMiddleware`, `compose`
- Multiple libraries: `redux`, `react-redux`, `reselect`, `redux-thunk`
- Steep learning curve.  Master all of the above before you get started -- otherwise you may end up creating your own middleware to handle async actions!

Along comes `@reduxjs/toolkit` to help standardize some of this.

## Implementation
```bash
npm uninstall redux reselect redux-thunk
npm i @reactjs/toolkit
```

The `@reactjs/toolkit` bundles all of these libraries together and configures Redux DevTools.  This means we have a single place where we import from, too.  Using the toolkit cleans up our code and reduces cognitive load.

### Refactor the store
`src/store/store.js`
```diff
- import { createStore, applyMiddleware, compose } from 'redux';
- import thunk from 'redux-thunk';
+ import { configureStore } from '@reduxjs/toolkit';
- import rootReducer from './rootReducer';
+ import counter from './counter';
+ import dogs from './dogs';

- export default createStore(
-   rootReducer,
-   compose(
-     applyMiddleware(thunk),
-     window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f
-   )
- );
+ export default configureStore({
+   reducer: {
+     counter,
+     dogs,
+   },
+ });
```

We no longer need the rootReducer, which means we can stop using `combineReducers`!

Delete `src/store/rootReducer.js`.
```diff
- import { combineReducers } from 'redux';
- import counter from './counter';
- import dogs from './dogs';
- 
- export default combineReducers({
-   counter,
-   dogs,
- });
```

### Refactor `counter`
The toolkit allows you to reduce some boilerplate by merging constants, action creators, initial state, and reducers into a "slice".

`src/counter/slice.js`
```js
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

export const { incrementCount, decrementCounter } = slice.actions;
```

Rule #1 in Redux is NEVER mutate the state.  And here in the reducers it looks like we are.  The docs clarify this though:

> Redux Toolkit allows us to write "mutating" logic in reducers. It<br>
> doesn't actually mutate the state because it uses the Immer library,<br>
> which detects changes to a "draft state" and produces a brand new<br>
> immutable state based off those changes<br>

The "slice" is an object that has the resulting `reducer` and also the various action creators.

`src/store/counter/index.js`
```diff
- export { default } from './reducer';
- export * from './actions';
+ export { default } from './slice';
+ export * from './slice';
  export * from './selectors';
```

Delete:
- `src/store/counter/constants.js`
- `src/store/counter/actions.js`
- `src/store/counter/reducer.js`

### Refactor `dogs`

The toolkit does some of the monotonous work with thunks for us.

Refactor `src/store/dogs/thunks.js`
```diff
- import * as CONST from './constants';
+ import { createAsyncThunk } from '@reduxjs/toolkit';

- export const loadBreeds = (arg) => async (dispatch, getState) => {
+ export const loadBreeds = createAsyncThunk('loadBreeds', async (payload, { dispatch, getState }) => {
-    try {
-      dispatch({
-        type: CONST.DOGS_LOAD_BREEDS_PENDING,
-        meta: { arg },
-      });
-
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      const json = await response.json();
      const breeds = Object.entries(json.message).reduce(
        (arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)),
        []
      );
+     return breeds;
-
-     dispatch({
-       type: CONST.DOGS_LOAD_BREEDS_FULFILLED,
-       meta: { arg },
-       payload: breeds,
-     });
-   } catch (error) {
-     dispatch({
-       type: CONST.DOGS_LOAD_BREEDS_REJECTED,
-       meta: { arg },
-       error,
-     });
-   }
- };
+ });
```

When we create the slice for this, it will be similar to how we created the slice for `counter`, except we need to include some extra reducer instructions for the thunk.

`src/store/dogs/slice.js`
```js
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
```

The `reducers` section will create corresponding "action creator" functions.  The `extraReducers` will not create additional actions.

Update `src/store/dogs/index.js`
```diff
- export { default } from './reducer';
- export * from './actions';
+ export { default } from './slice';
+ export * from './slice';
  export * from './thunks';
  export * from './selectors';
```

Delete:
- `src/store/dogs/constants.js`
- `src/store/dogs/actions.js`
- `src/store/dogs/reducer.js`
