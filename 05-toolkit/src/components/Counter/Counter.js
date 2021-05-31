import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCounter, incrementCounter, decrementCounter } from '../../store';

const Counter = () => {
  const { min, max, current } = useSelector(selectCounter);
  const dispatch = useDispatch();

  const onIncrement = useCallback(() => {
    dispatch(incrementCounter());
  }, [dispatch]);

  const onDecrement = useCallback(() => {
    dispatch(decrementCounter());
  }, [dispatch]);

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
