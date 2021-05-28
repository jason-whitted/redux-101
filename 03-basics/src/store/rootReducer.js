import { combineReducers } from 'redux';
import counter from './counter';
import dogs from './dogs';

export default combineReducers({
  counter,
  dogs,
});
