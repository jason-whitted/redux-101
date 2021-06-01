import { configureStore } from '@reduxjs/toolkit';
import preloadedState from './perloadedState';
import persist from './persist';
import counter from './counter';
import dogs from './dogs';

export default configureStore({
  reducer: {
    counter,
    dogs,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persist),
});
