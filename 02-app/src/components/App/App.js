import React from 'react';
import Counter from '../Counter';
import DogImage from '../DogImage/DogImage';
import Dogs from '../Dogs';
import './styles.scss';

const App = () => (
  <div className="container mt-4">
    <Counter />
    <Dogs />
    <DogImage />
  </div>
);

export default App;
