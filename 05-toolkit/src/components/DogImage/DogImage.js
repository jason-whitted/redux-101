import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentCounter, selectCurrentBreed } from '../../store';

const DogImage = () => {
  const imageIndex = useSelector(selectCurrentCounter);
  const breed = useSelector(selectCurrentBreed);

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
