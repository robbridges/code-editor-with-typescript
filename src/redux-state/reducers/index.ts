import cellReducer from './cellReducer';
import bundlesReducer from './bundlesReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  cells: cellReducer,
  bundles: bundlesReducer,
});

export default reducers;

export type RootState = ReturnType<typeof reducers>;