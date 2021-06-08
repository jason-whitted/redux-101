import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectDogs, loadBreeds, setCurrentBreed } from '../../store';

const Dogs = () => {
  const { breeds, current } = useSelector(selectDogs);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!breeds.length) {
      dispatch(loadBreeds());
    }
  }, [dispatch, breeds]);

  const onChange = useCallback(
    (event) => {
      const { value } = event.target;
      if (breeds.includes(value)) {
        dispatch(setCurrentBreed(value));
      }
    },
    [breeds, dispatch]
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
