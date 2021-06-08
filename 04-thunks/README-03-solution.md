# Thunk: The Solution

## Definition(s)

> \thəŋk\ - dialectal past tense and past participle of THINK<br>
> **- Merriam Webster**

> In computer programming, a thunk is a subroutine used to inject an additional calculation into another subroutine. Thunks are primarily used to delay a calculation until its result is needed, or to insert operations at the beginning or end of the other subroutine.<br>
> **- Wikipedia**

## What is it?

By default, Redux can only dispatch `Action` objects:

`{ type: string, payload?: any }`

Redux has the ability to handle middleware, which allows end users to have fine-tune control during dispatch.

When Redux is used with the "thunk middleware", the end result is that you can dispatch functions.  These functions are referred to as "thunks".  A "thunk" will have access to the entire store's state and be able to dispatch actions asynchronously.

**Sounds Complicated!** 

But it's not.  From [redux-thunk](https://github.com/reduxjs/redux-thunk/blob/master/src/index.js) here's the entire thunk middleware.

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument);
    }

    return next(action);
  };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
```

## OK... but WTF is a thunk?
Previously we only dispatched the result of an action creator:

`(...args) => ({ type: string, payload?: any })`

A thunk lets us dispatch a function instead of an object.  We can dispatch the result of a thunk creator (nobody calls them "thunk creators"):

`(...args) => (dispatch, getState) => { ... }`

A thunk is a function that will receive the store's `dispatch` and `getState` functions. The function body can then interact with the store asynchronously at its leisure.

## Installation

```bash
npm i redux-thunk
```

Now we need to apply the thunk middleware to the store.

> **Flashback:**<br>
> Redux can only have one reducer.  If you want to specify multiple reducers we use the `combineReducers` helper function.

Similarly, Redux can only have one middleware (and we are already using the Redux DevTools middleware).  If you want to specify multiple middleware we use the `applyMiddleware` helper function.

`src/store/store.js`
```diff
- import { createStore } from 'redux';
+ import { createStore, applyMiddleware, compose } from 'redux';
+ import thunk from 'redux-thunk';
  import rootReducer from './rootReducer';

  export default createStore(
    rootReducer,
-    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
+   compose(
+     applyMiddleware(thunk),
+     window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
+   )
  );
```

## Implement `loadBreeds` thunk
The simplest version of `loadBreeds` may look like this:
```js
import { setBreeds } from './actions';

export const loadBreeds = () => async (dispatch, getState) => {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  const json = await response.json();
  const breeds = Object.entries(json.message).reduce(
    (arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)),
    []
  );
  dispatch(setBreeds(breeds));
};
```

But it's really common to want to let the redux store know that an async action is occurring.  Then we could display the loading state, or an error state, etc.

Let's create three constants to help handle these.

`src/dogs/constants.js`
```diff
  export const DOGS_SET_BREEDS = 'dogs/setBreeds';
  export const DOGS_SET_CURRENT_BREED = 'dogs/setCurrentBreed';
+ export const DOGS_LOAD_BREEDS_PENDING = 'dogs/loadBreeds/pending';
+ export const DOGS_LOAD_BREEDS_FULFILLED = 'dogs/loadBreeds/fulfilled';
+ export const DOGS_LOAD_BREEDS_REJECTED = 'dogs/loadBreeds/rejected';
```

Now we could implement these states and basic error handling by simply implementing a try..catch and dispatching simple actions.

```diff
+ import * as CONST from './constants';
- import { setBreeds } from './actions';

  export const loadBreeds = () => async (dispatch, getState) => {
+   try {
+     dispatch({ type: CONST.DOGS_LOAD_BREEDS_PENDING });
      const response = await fetch('https://dog.ceo/api/breeds/list/all');
      const json = await response.json();
      const breeds = Object.entries(json.message).reduce(
        (arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)),
        []
      );
-     dispatch(setBreeds(breeds));
+     dispatch({ type: CONST.DOGS_LOAD_BREEDS_FULFILLED, payload: breeds });
+   } catch(error) {
+     dispatch({ type: CONST.DOGS_LOAD_BREEDS_REJECTED })
+   }
  };
```

We could take this a step further and allow this thunk to be a bit more extensible and also make the various actions contain a bit more data that may be useful in the reducer.

```diff
import * as CONST from './constants';

- export const loadBreeds = () => async (dispatch, getState) => {
+ export const loadBreeds = (arg) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CONST.DOGS_LOAD_BREEDS_PENDING,
+     meta: { arg },
    });

    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const json = await response.json();
    const breeds = Object.entries(json.message).reduce(
      (arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)),
      []
    );

    dispatch({
      type: CONST.DOGS_LOAD_BREEDS_FULFILLED,
+     meta: { arg },
      payload: breeds,
    });
  } catch (error) {
    dispatch({
      type: CONST.DOGS_LOAD_BREEDS_REJECTED,
+     meta: { arg },
+     error,
    });
  }
};
```

Now the reducer will know the input parameter (if any) that was passed to the thunk via `action.meta.arg`.  Additionally, when an error occurs the action will also receive the specific error via `action.error`.

Remember when I said an Action has the shape `{ type: string, payload?: any }` -- that is by true, but by convention only.

With our thunks in the mix we could consider an Action to have the shape:

```typescript
{
  type: string,
  payload?: any,
  meta?: {
    arg?: any,
  },
  error?: any,
}
```

Next, we need to update the reducer to handle these new actions.

`src/store/dogs/reducer.js`
```diff
  import * as CONST from './constants';
  import initialState from './initialState';

- export default (state = initialState, { type, payload }) => {
+ export default (state = initialState, { type, payload, meta, error }) => {
    switch (type) {
+     case CONST.DOGS_LOAD_BREEDS_PENDING:
+       return {
+         ...state,
+         loading: true,
+         error: undefined,
+       };
+     case CONST.DOGS_LOAD_BREEDS_FULFILLED:
+       return {
+         ...state,
+         loading: false,
+         breeds: payload,
+       };
+     case CONST.DOGS_LOAD_BREEDS_REJECTED:
+       return {
+         ...state,
+         loading: false,
+         error,
+       };
      case CONST.DOGS_SET_BREEDS:
        return {
          ...state,
          breeds: payload,
        };
      case CONST.DOGS_SET_CURRENT_BREED:
        return {
          ...state,
          current: payload,
        };
      default:
        return state;
    }
  };
```

Now we need to export this thunk so components can use it.

`src/store/dogs/index.js`
```diff
  export { default } from './reducer';
  export * from './actions';
+ export * from './thunks';
  export * from './selectors';
```

Finally, we can update the `Dogs` component to use the `loadBreeds` thunk.

`src/components/Dogs/Dogs.js`
```diff
  import React, { useCallback, useEffect } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
- import { selectDogs, setBreeds, setCurrentBreed } from '../../store';
+ import { selectDogs, loadBreeds, setCurrentBreed } from '../../store';

  const Dogs = () => {
    const { breeds, current } = useSelector(selectDogs);
    const dispatch = useDispatch();

    useEffect(() => {
-      fetch('https://dog.ceo/api/breeds/list/all')
-        .then((r) => r.json())
-        .then(({ message }) => message)
-        .then(Object.entries)
-        .then((entries) =>
-          entries.reduce((arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)), [])
-        )
-        .then((arr) => dispatch(setBreeds(arr)));
+      dispatch(loadBreeds());
    }, [dispatch]);
```

Additionally, when you dispatch a thunk you receive the result of the function.  In the case of `loadBreeds` we would receive a `Promise`.  This means we **could** (but won't) use that to handle a loading indicator:

```js
try {
  setLoading(true);
  await dispatch(loadBreeds());
} finally {
  setLoading(false);
}
```