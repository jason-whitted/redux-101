import React, { useCallback, useState } from 'react';

const Counter = () => {
  const min = 0;
  const max = 10;

  const [current, setCurrent] = useState(min);

  const onIncrement = useCallback(() => {
    setCurrent((cur) => Math.min(cur + 1, max));
  }, [max]);

  const onDecrement = useCallback(() => {
    setCurrent((cur) => Math.max(cur - 1, min));
  }, [min]);

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
