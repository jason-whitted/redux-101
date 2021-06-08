const debounce = (fn, ms) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
};

const save = debounce((state) => {
  try {
    localStorage.setItem('redux-101/store', JSON.stringify(state));
  } catch (error) {
    console.error(error);
  }
}, 250);

const persist = (store) => (next) => (action) => {
  const result = next(action);
  save(store.getState());
  return result;
};

export default persist;
