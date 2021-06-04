# The Problem

## Redux Limitations

A reducer only has access to the current slice's `state` and the `action`.  This means the `dogs` reducer does not have access to the `counter` state.

If a reducer wanted to read state from another slice it would need access to `store.getState()`.

If we tried to import the `store` into a reducer we would create a cyclic dependency:

> `reducer.js`<br>
> &gt; `store.js`<br>
> &gt; `rootReducer.js`<br>
> &gt; `reducer.js`

We could try to make the store globally accessible so we don't have to worry about cyclic dependencies.

```js
const store = createStore(...);
window.store = store;
export default store;
```

Then in the reducer you could try to read state:
```js
export default (state = initialState, { type, payload }) => {
  switch(type) {
    case LOAD:
      console.log(window.store.getState());
      return state;
    default:
      return state;
  }
}
```

But Redux would throw this error:
```diff
- Unhandled Rejection (Error): You may not call store.getState() while the reducer is executing. The reducer has already received the state as an argument. Pass it down from the top reducer instead of reading it from the store.
```

Similarly if we tried to dispatch an action from within the reducer:
```js
export default (state = initialState, { type, payload }) => {
  switch(type) {
    case LOAD:
      window.store.dispatch({ type: 'testing', payload: 123 });
      return state;
    default:
      return state;
  }
}
```

Redux would throw this error:
```diff
- Unhandled Rejection (Error): Reducers may not dispatch actions.
```

## The End Result
- A reducer must return state synchronously / immediately.
- A reducer cannot dispatch other actions.
- A reducer only has access to its own slice's state.

These seem like pretty large handcuffs.

Thunks to the rescue.
