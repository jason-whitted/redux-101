import { configureStore } from '@reduxjs/toolkit';
import counter from './counter';
import dogs from './dogs';

export default configureStore({
  reducer: {
    counter,
    dogs,
  },
});
