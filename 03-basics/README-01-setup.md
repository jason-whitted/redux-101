# Installation
```bash
npm i redux react-redux reselect
```

# The State
```js
{
  counter: {
    min: 0,
    max: 10,
    current: 0,
  },
  dogs: {
    breeds: [],
    current: '',
  },
}
```

Right now our state has two slices: `counter` and `dogs`.  We'll need to create reducers for these.

# Reducer: `counter`
`src/store/counter/initialState.js`
```js
export default {
  min: 0,
  max: 10,
  current: 0,
};
```

`src/store/counter/reducer.js`
```js
import initialState from './initialState';

/* The reducer is where we would handle state updates via actions.  
 * But we don't even know what actions we want yet.
 * Let's implement these as we need them.
 * And right at this moment we don't need them.
 */
export default (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};
```

`src/store/counter/index.js`
```js
export { default } from './reducer';
```

# Reducer: `dogs`
`src/store/dogs/initialState.js`
```js
export default {
  breeds: [],
  current: '',
};
```

`src/store/dogs/reducer.js`
```js
import initialState from './initialState';

/* The reducer is where we would handle state updates via actions.  
 * But we don't even know what actions we want yet.
 * Let's implement these as we need them.
 * And right at this moment we don't need them.
 */
export default (state = initialState, { type, payload }) => {
  switch (type) {
    default:
      return state;
  }
};
```

`src/store/dogs/index.js`
```js
export { default } from './reducer';
```

# The Root Reducer
Right now we have the two "slices" of the state: `counter` and `dogs`. Redux needs a single reducer, but it provides us a helper function to merge multiple reducers into a single reducer.

`src/store/rootReducer.js`
```js
import { combineReducers } from 'redux';
import counter from './counter';
import dogs from './dogs';

export default combineReducers({
  counter,
  dogs,
});
```

# The Store
`src/store/store.js`
```js
import { createStore } from 'redux';
import rootReducer from './rootReducer';

export default createStore(rootReducer);
```

This `store` object is really simple.  It's an object that has two methods:
- `getState(): any`
  - Returns the current state.
- `dispatch(Action): any`
  - Sends an action to the reducer, which is in turn sent to each "slice" reducer.
  - An action is an object with the shape: `{ type: string, payload: any }`
  - !GOTCHA! The `state` passed to the "slice" reducers is not the entire state, but only the slice's state.
    - This means that the `counter` reducer does not have access to the `dogs` state and vice versa. If both slices need to be updated by an action, then both reducers need to handle the action individually.
    - This also means that the "selectors" that we will create soon will not work properly in a reducer.
  
# The Provider
Redux is an unopinionated state store.  It's not at all linked to React.  We use `react-redux` to let us interact with Redux from React.

`src/index.js`
```diff
import React from 'react';
import ReactDOM from 'react-dom';
+ import { Provider as Redux } from 'react-redux';
+ import store from './store/store';
import App from './components/App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
+    <Redux store={store}>
      <App />
+    </Redux>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

That's it.  Now our components all have access to the state store.

# DevTools
At this point we've created a store, but since we haven't yet created any actions to change the store or selectors to read from the store we don't have "proof" that the store is there.

We have Redux DevTools installed, but we have to tell our Redux store to connect to the DevTools extension.  In order to do this we need to configure a "middleware".

`src/store/store.js`
```diff
import { createStore } from 'redux';
import rootReducer from './rootReducer';

export default createStore(
  rootReducer,
+ /* preloadedState, */
+ window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
```

Now we can see our store in Redux DevTools.
