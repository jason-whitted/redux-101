# Selectors
A "selector" is simply a function used to read data from the store. A selector can return any data type, but it must, by definition, take only a single parameter, `state`, as input.  A "selector" must have the signature:

```js
(state) => any
```

Just like the standard for React hooks is to prefix the hook function with `use`, it's a best practice to prefix your selector functions with `select`.

Our `Counter` component is going to need `min`, `max`, and `current` values from the `counter` slice of the state; however, other components may only care about the `current` value.  Let's start by creating two selectors.

## Selectors: `selectCounter` and `selectCurrentCounter`
`src/store/counter/selectors.js`
```js
export const selectCounter = (state) => state.counter;
export const selectCurrentCounter = (state) => state.counter.current;
```

Notice that the `selectCurrentCounter` is really just reaching deeper into the same result that `selectCounter` was.  We could rewrite these functions as:

```js
export const selectCounter = (state) => state.counter;
export const selectCurrentCounter = (state) => selectCounter(state).current;
```

Now we only reference `state.counter` once, which means we could refactor the slice name later without having to necessarily do a global find and replace.  Or we could add some memoization to the selector and subsequent calls to the memoized function are optimized for free.  While it may seem trivial, this is not just a good pattern, it is a great pattern.

The `reselect` library provides a function `createSelector` which is used to compose and memoize selector functions.  The signature of `createSelector` throws people for a loop, so let's cover it before implementing it.

First off, `createSelector` is a higher-order function.  It always returns a selector -- that is to say that it returns a function with the signature `(state) -> any`.

As input, `createSelector` can take *n* selector functions as parameters, and the last parameter is a composite function.

`createSelector(selector1, selector2, [...selectorN], compositeFunction)`

The compositeFunction is a function which receives as input all of the output from the specified selectors.

WTF?

Let's see a quick example:

```js
const selectFirstName = (state) => state.name.first;
const selectMiddleName = (state) => state.name.middle;
const selectLastName = (state) => state.name.last;
const selectFullName = createSelector(
  selectFirstName,
  selectMiddleName,
  selectLastName,
  (first, middle, last) => `${first} ${middle} ${last}`
);
```

We could even take this one step further:

```js
const selectName = (state) => state.name;
const selectFirstName = createSelector(selectName, ({ first }) => first);
const selectMiddleName = createSelector(selectName, ({ middle }) => middle);
const selectLastName = createSelector(selectName, ({ last }) => last);
const selectFullName = createSelector(
  selectFirstName,
  selectMiddleName,
  selectLastName,
  (first, middle, last) => `${first} ${middle} ${last}`
);
```

There's huge benefit to using `createSelector`.  It utilizes "memoizeOne" memoization -- if you call it with the same state object twice in a row it will just return you the previous result without any recalculation.

"Big whoop," you say. Let's give another example.

```js
const selectNumbers = (state) => state.numbers;
const selectTop1000Numbers = (state) => state.numbers.slice(0, 1000);
const selectTop1000NumbersSorted = (state) => state.numbers.slice(0, 1000).sort();
```

Pretend that `state.numbers` changes once every 5 minutes.  Now imagine a component that renders multiple times per second that needs the result from `selectTop1000NumbersSorted`.

Each time that `selectTop1000NumbersSorted(state)` is called it will have to:
- create a new array: `O(n)`
- sort the array: `O(n log n)`

Now we simply rewrite those selectors:

```js
const selectNumbers = (state) => state.numbers;
const selectTop1000Numbers = createSelector(selectNumbers, (numbers) => numbers.slice(0, 1000));
const selectTop1000NumbersSorted = createSelector(selectTop1000Numbers, (numbers) => [...numbers].sort());
```

Now only the first render ever 5 minutes would take the computation penalty.  The rest of the time the state hasn't changed for these selectors and it would simply return the last cached value: `O(1)`.

That being said, let's rewrite the counter selectors:
`src/store/counter/selectors.js`
```js
import { createSelector } from 'reselect';

export const selectCounter = (state) => state.counter;
export const selectCurrentCounter = createSelector(selectCounter, ({ current }) => current);
```


## Selectors: `selectDogs` and `selectCurrentBreed`
`src/store/dogs/selectors.js`
```js
import { createSelector } from 'reselect';

export const selectDogs = (state) => state.dogs;
export const selectCurrentBreed = createSelector(selectDogs, ({ current }) => current);
```

## Exporting Selectors
We'll want to consume these selectors from our React components, so we should export them.  

`src/store/counter/index.js`
```diff
  export { default } from './reducer';
+ export * from './selectors';
```

`src/store/dogs/index.js`
```diff
  export { default } from './reducer';
+ export * from './selectors';
```

Consumers of the store really shouldn't care about the `store` object, reducers, constants, etc.  They should only care about the "selectors" and "actions".  The `index.js` files of each slice is currently exporting the reducer as the default export and the selectors as named exports.  If we use `export *` from there it will only export the named exports.

`src/store/index.js`
```js
export * from './counter';
export * from './dogs';
```
