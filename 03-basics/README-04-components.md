# Update Components

## `Counter` Component
```diff
- import React, { useCallback, useState } from 'react';
+ import React, { useCallback } from 'react';
+ import { useDispatch, useSelector } from 'react-redux';
+ import { selectCounter, incrementCounter, decrementCounter } from '../store';

  const Counter = () => {
-   const min = 0;
-   const max = 10;

-   const [current, setCurrent] = useState(min);
+   const { min, max, current } = useSelector(selectCounter);
+   const dispatch = useDispatch();

    const onIncrement = useCallback(() => {
-      setCurrent((cur) => Math.min(cur + 1, max));
+      dispatch(incrementCounter());
-    }, [max]);
+    }, [dispatch]);

    const onDecrement = useCallback(() => {
-     setCurrent((cur) => Math.max(cur - 1, min));
+     dispatch(decrementCounter());
-   }, [min]);
+   }, [dispatch]);

    return (
      <div className="Counter card">
        <div className="card-header">Counter</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="counter-current">Current:</label>
            <input id="counter-current" type="text" className="form-control" readOnly="readOnly" value={current} />
          </div>
        </div>
        <div className="card-footer">
          <div className="btn-group">
            <button type="button" className="btn btn-primary" onClick={onDecrement} disabled={current === min}>
              -
            </button>
            <button type="button" className="btn btn-primary" onClick={onIncrement} disabled={current === max}>
              +
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Counter;
```

## `Dogs` Components
```diff
- import React, { useCallback, useEffect, useState } from 'react';
+ import React, { useCallback, useEffect } from 'react';
+ import { useDispatch, useSelector } from 'react-redux';
+ import { selectDogs, setBreeds, setCurrentBreed } from '../../store';

  const Dogs = () => {
-   const [breeds, setBreeds] = useState([]);
-   const [current, setCurrent] = useState('');
+   const { breeds, current } = useSelector(selectDogs);
+   const dispatch = useDispatch();

    useEffect(() => {
      fetch('https://dog.ceo/api/breeds/list/all')
        .then((r) => r.json())
        .then(({ message }) => message)
        .then(Object.entries)
        .then((entries) =>
          entries.reduce((arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)), [])
        )
-       .then(setBreeds);
+       .then((arr) => dispatch(setBreeds(arr)));
-   }, []);
+   }, [dispatch]);

    const onChange = useCallback(
      (event) => {
        const { value } = event.target;
        if (breeds.includes(value)) {
-         setCurrent(value);
+         dispatch(setCurrentBreed(value));
        }
      },
-     [breeds]
+     [breeds, dispatch]
    );

    return (
      <div className="Dogs card">
        <div className="card-header">Dogs</div>
        <div className="card-body">
          <div className="form-group">
            <label id="dogs-current">Current:</label>
            <input className="form-control" id="dogs-current" readOnly value={current} />
          </div>
        </div>
        <div className="card-footer">
          <div className="form-group">
            <label htmlFor="dogs-breed">Breed:</label>
            <input className="form-control" id="dogs-breed" list="breeds" onChange={onChange} disabled={!breeds.length} />
            <datalist id="breeds">
              {breeds.map((b) => (
                <option key={b} value={b} />
              ))}
            </datalist>
          </div>
        </div>
      </div>
    );
  };

  export default Dogs;
```

## `DogImage` Component
```diff
  import React, { useEffect, useMemo, useState } from 'react';
+ import { useSelector } from 'react-redux';
+ import { selectCurrentCounter, selectCurrentBreed } from '../../store';

  const DogImage = () => {
-   const imageIndex = 0;
+   const imageIndex = useSelector(selectCurrentCounter);
-   const breed = '';
+   const breed = useSelector(selectCurrentBreed);

    const [images, setImages] = useState([]);

    const current = useMemo(() => images[imageIndex], [images, imageIndex]);

    useEffect(() => {
      if (breed) {
        fetch(`https://dog.ceo/api/breed/${breed}/images`)
          .then((r) => r.json())
          .then(({ message }) => message)
          .then(setImages);
      }
    }, [breed]);

    return (
      <div className="DogImage card">
        <div className="card-header">Dog Image</div>
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="dog-image-index">Breed:</label>
            <input id="dog-image-index" type="text" className="form-control" readOnly="readOnly" value={breed} />
          </div>
          <div className="form-group">
            <label htmlFor="dog-image-breed">Image Index:</label>
            <input id="dog-image-breed" type="text" className="form-control" readOnly="readOnly" value={imageIndex} />
          </div>
        </div>
        <div className="card-footer">
          {current && <img src={current} />}
          {!current && '¯\\_(ツ)_/¯'}
        </div>
      </div>
    );
  };

  export default DogImage;
```