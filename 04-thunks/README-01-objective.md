# Objective

Currently the `Dogs` component contains the business logic to load the breeds.

```js
useEffect(() => {
  fetch('https://dog.ceo/api/breeds/list/all')
    .then((r) => r.json())
    .then(({ message }) => message)
    .then(Object.entries)
    .then((entries) =>
      entries.reduce((arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)), [])
    )
    .then((arr) => dispatch(setBreeds(arr)));
}, [dispatch]);
```

We'd much rather dispatch a simple action and let Redux handle the business logic.  Something like:

```js
useEffect(() => {
  dispatch(loadBreeds());
}, [dispatch]);
```
