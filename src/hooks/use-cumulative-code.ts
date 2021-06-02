import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellID: string) => {
  return useTypedSelector((state) => {
    const {data, order } = state.cells;
    const orderedCells = order.map(id => data[id]);
    /* this is our magic that allows a user to use a "Show" fuction in our editor, we inject some Javascript 
       and do if statement checks to try to determine what the user is trying, rather it be a JSX/React element An object, or just showing showthing to the root div that we've made.

    */
    const showFuction = ` 
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root)
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      };
    `;
    // this is non operational show Fuction, we pass in an empty var with no logic if the code cell we are looking is not the current one calling show
    const showFunctionNonOperational = 'var show = () => {}'
    
    const cumulativeCode = [];
    for (let c of orderedCells) {
      if (c.type === 'code') {
        if (c.id === cellID) {
          cumulativeCode.push(showFuction); // if the cell we are looking at is the same as the current cell, we want to actually use the show fuction
        } else {
          cumulativeCode.push(showFunctionNonOperational) // if it is now we do not want to show the previous cells show fuction, this stops the same show form rendering in all iframes
        } 
        cumulativeCode.push(c.content);
      }
      if (c.id === cellID) {
        break;
      }
    }
    return cumulativeCode;
  }).join('\n');
}