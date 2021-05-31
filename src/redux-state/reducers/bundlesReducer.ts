import produce from 'immer';
import {ActionType} from '../action-types';
import {Action} from '../actions';

// just like our cell reducer we need to create action types for the bundle reducer, show a loading bar, remove errors from local state. 
interface BundlesState {
  [key: string]: {
    loading: boolean;
    code: string;
    error: string;
  } | undefined;
}

const intialState: BundlesState = {};

const reducer = produce((state: BundlesState = intialState, action: Action): BundlesState => {
  switch (action.type) {
    // create a brand new bundle, throw away and old data that the bundle may have had. Basically restore default settings. 
    case ActionType.BUNDLE_START:
      state[action.payload.cellId] = {
        loading: true,
        code: '',
        error: '',
      };
      return state;
    // upon bundle completing we are assigning the value that is in the bundle state 
    case ActionType.BUNDLE_COMPLETE:
      state[action.payload.cellId] = {
        loading: false,
        code: action.payload.bundle.code,
        error: action.payload.bundle.error,
      };
      return state;  
    default:
      return state;  
  }
});

export default reducer;
