# Actions
In Redux when we refer to an "action" we typically are NOT referring to the object that is sent to dispatch (and subsequently to the reducer).

`{ type: string, payload?: any }`

Instead we are referring to an action creator.  And action creator is simply a helper function that helps us create one of these objects.

An action creator can accept any number of arguments, but must always return an object with the above shape.

`(...params) => ({ type: string, payload?: any })`

The `type` is going to be referenced by both the reducer and the action creator functions, so we typically create constants for these.

## Action: `incrementCounter` and `decrementCounter`
`src/store/counter/constants.js`
```js
export const COUNTER_INCREMENT = 'counter/increment';
export const COUNTER_DECREMENT = 'counter/decrement';
```

`src/store/counter/actions.js`
```js
import * as CONST from './constants';

export const incrementCounter = () => ({ type: CONST.COUNTER_INCREMENT });
export const decrementCounter = () => ({ type: CONST.COUNTER_DECREMENT });
```

`src/store/counter/index.js`
```diff
  export { default } from './reducer';
+ export * from './actions';
  export * from './selectors';
```

`src/store/counter/reducer.js`
```diff
+ import * as CONST from './constants';
  import initialState from './initialState';

  export default (state = initialState, { type, payload }) => {
    switch (type) {
+     case CONST.COUNTER_DECREMENT:
+       return {
+         ...state,
+         current: Math.max(state.min, state.current - 1),
+       };
+     case CONST.COUNTER_INCREMENT:
+       return {
+         ...state,
+         current: Math.min(state.max, state.current + 1),
+       };
      default:
        return state;
    }
  };
```

## Action: `setBreeds` and `setCurrentBreed`
`src/store/dogs/constants.js`
```js
export const DOGS_SET_BREEDS = 'dogs/setBreeds';
export const DOGS_SET_CURRENT_BREED = 'dogs/setCurrentBreed';
```

`src/store/dogs/actions.js`
```js
import * as CONST from './constants';

export const setBreeds = (breeds) => ({ 
  type: CONST.DOGS_SET_BREEDS,
  payload: breeds,
});

export const setCurrentBreed = (breed) => ({
  type: CONST.DOGS_SET_CURRENT_BREED,
  payload: breed,
});
```

`src/store/dogs/index.js`
```diff
  export { default } from './reducer';
+ export * from './actions';
  export * from './selectors';
```

`src/store/dogs/reducer.js`
```diff
+ import * as CONST from './constants';
  import initialState from './initialState';

  export default (state = initialState, { type, payload }) => {
    switch (type) {
+     case CONST.DOGS_SET_BREEDS:
+       return {
+         ...state,
+         breeds: payload,
+       };
+     case CONST.DOGS_SET_CURRENT_BREED:
+       return {
+         ...state,
+         current: payload,
+       };
      default:
        return state;
    }
  };
```
