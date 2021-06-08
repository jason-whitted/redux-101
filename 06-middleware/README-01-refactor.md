# Middleware

## Extensibility
Redux has two different paradigms for modifying the inner workings of the store.
1. Enhancers - override or replace any of the store's methods: `dispatch`, `getState`, and `subscribe`
2. Middleware - provides a third-party extension point between dispatching an action, and the moment it reaches the reducer

Redux is built upon functional programming paradigms and it is no surprise that middleware is a higher-order function.

```js
function middleware(store) {
  return function wrapDispatch(next) {
    return function handleAction(action) {
      // Do anything here: pass the action onwards with next(action),
      // or restart the pipeline with storeAPI.dispatch(action)
      // Can also use storeAPI.getState() here

      return next(action);
    }
  }
}
```

Or more concisely:

```js
const middleware = (store) => (next) => (action) => {
  // ...
  return next(action);
}
```

- `store` - the actual store object containing `dispatch` and `getState`
- `next` - the next middleware in the pipeline (or `dispatch` if last)
  - If you don't call `next(action)` then the dispatch stops at your middleware, which means the action will not reach the reducer, DevTools doesn't receive the event for logging, etc.
- `action` is the next action object
  - not a thunk function, redux-thunk doesn't relay those

## Implementing Persistance
Let's create a persistance middleware that will serialize the state to localStorage and also initialize the store on initial load.

Create the middleware:

`src/store/persist.js`
```js
const debounce = (fn, ms) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  }
};

const save = debounce((state) => {
  try {
    localStorage.setItem('redux-101/store', JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}, 250);

const persist = (store) => (next) => (action) => {
  const result = next(action);
  save(store.getState());
  return result;
};

export default persist;
```

Add it to the store:

`src/store/store.js`
```diff
  import { configureStore } from '@reduxjs/toolkit';
+ import persist from './persist';
  import counter from './counter';
  import dogs from './dogs';

  export default configureStore({
    reducer: {
      counter,
      dogs,
    },
+   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persist),
  });
```

`@reduxjs/toolkit` makes adding middleware much easier -- no `compose` or `applyMiddleware` needed.  We can simply specify an array of middlewares to use.  Alternately we can specify a function and they will pass us a helper function to get the default middleware (thunks, DevTools) and we can just concat our middleware to the end of that array.

## Implement Initialization
Now we want the store to initialize based on localStorage.

`src/store/preloadedState.js`
```js
const load = () => {
  try {
    return JSON.parse(localStorage.getItem('redux-101/store')) || undefined;
  } catch (error) {
    localStorage.removeItem('redux-101/store');
    console.error(error);
    return undefined;
  }
};

export default load();
```

And configure the store to use this preloadedState during initialization.

`src/store/store.js`
```diff
  import { configureStore } from '@reduxjs/toolkit';
+ import preloadedState from './preloadedState';
  import persist from './persist';
  import counter from './counter';
  import dogs from './dogs';

  export default configureStore({
    reducer: {
      counter,
      dogs,
    },
+   preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persist),
  });
```
