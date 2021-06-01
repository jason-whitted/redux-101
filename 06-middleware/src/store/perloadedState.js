const load = () => {
  try {
    return JSON.parse(localStorage.getItem('redux-101/store')) || undefined;
  } catch (error) {
    localStorage.removeItem('redux-101/store');
    console.error(error);
    return undefined;
  }
};

export default load();
