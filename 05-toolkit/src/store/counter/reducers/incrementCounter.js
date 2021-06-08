const incrementCounter = (state) => {
  state.current = Math.min(state.max, state.current + 1);
};

export default incrementCounter;
