const decrementCounter = (state) => {
  state.current = Math.max(state.min, state.current - 1);
};

export default decrementCounter;
