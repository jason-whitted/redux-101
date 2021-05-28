import React, { useCallback, useEffect, useState } from 'react';

const Dogs = () => {
  const [breeds, setBreeds] = useState([]);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((r) => r.json())
      .then(({ message }) => message)
      .then(Object.entries)
      .then((entries) =>
        entries.reduce((arr, [breed, subs]) => arr.concat(breed, ...subs.map((sub) => `${breed}/${sub}`)), [])
      )
      .then(setBreeds);
  }, []);

  const onChange = useCallback(
    (event) => {
      const { value } = event.target;
      if (breeds.includes(value)) {
        setCurrent(value);
      }
    },
    [breeds]
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
