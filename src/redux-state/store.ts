import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { ActionType } from './action-types';

export const store = createStore(reducers, {}, applyMiddleware(thunk));



/* practice dispatch below to make sure out action types work. They do.  */
store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: 'null',
    type: 'code'
  }
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: 'null',
    type: 'text'
  }
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: 'null',
    type: 'code'
  }
});

store.dispatch({
  type: ActionType.INSERT_CELL_AFTER,
  payload: {
    id: 'null',
    type: 'text'
  }
});

// // store.dispatch({
  
// //   type: ActionType.DELETE_CELL,
// //   payload: store.getState().cells.order[0],
// // })

// store.dispatch({
//   type: ActionType.UPDATE_CELL,
//   payload: {
//     id: store.getState().cells.order[0],
//     content: 'Fuck yeah Immer',
//   }
// })

// store.dispatch({
//   type: ActionType.MOVE_CELL,
//   payload: {
//     id: store.getState().cells.order[0],
//     direction: 'up',
//   }
// })



