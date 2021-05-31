import produce from 'immer';

import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';


interface CellState {
  loading:boolean;
  error: string | null;
  order: string[];
  data: {
    [key: string]: Cell
  }
}

const initalState: CellState = {
  loading: false,
  error: null,
  order: [],
  data: {}
}
/* below is our cell reducer, we have defined an interface above of the values it should recieve. Below are the actual action types that can be called, and what they do.
mostly it is just moving the cell up and down, deleting it or creating a new one. 
*/
const reducer = produce((
  state: CellState = initalState, 
  action: Action
): CellState  => {
    switch (action.type) {
      case ActionType.UPDATE_CELL:
        const { id, content} = action.payload;
        state.data[id].content = content;
        return state;
      case ActionType.DELETE_CELL:
        delete state.data[action.payload];
        state.order = state.order.filter(id => id !==action.payload);
        return state;
      case ActionType.MOVE_CELL:
        const { direction } = action.payload
        const index = state.order.findIndex((id) => id === action.payload.id);
        const targetIndex = direction === 'up' ? index -1 : index + 1;

        if (targetIndex < 0 || targetIndex > state.order.length - 1) {
          return state;
        }

        state.order[index] = state.order[targetIndex];
        state.order[targetIndex] = action.payload.id;
        
        return state;
      case ActionType.INSERT_CELL_AFTER:
        const cell: Cell = {
          content: '',
          type: action.payload.type,
          id: randomId(),
        };

        state.data[cell.id] = cell;

        const foundIndex = state.order.findIndex(id => id === action.payload.id);

        if (foundIndex < 0) {
          state.order.unshift(cell.id);
        } else {
          state.order.splice(foundIndex + 1, 0, cell.id);
        }

        return state;
      default:
        return state;      
    } 
});

//useful random number generator to give each cell a random ID. 
const randomId = () => {
  return Math.random().toString(36).substr(2, 5);
};

export default reducer;