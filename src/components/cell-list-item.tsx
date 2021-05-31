import './cell-list-item.css';

import { Cell } from '../redux-state'
import CodeCell from './code-cell';
import TextEditor from './text-editor';
import ActionBar from './action-bar';

interface CellListItemProps {
  cell: Cell
}

/* an individual cell item, we render based on the cell component passed to props, Rather it be a code tell, or a text deitor cell. 
  We had to render action bar after the cell to show changing that breaks it as the cell buttons are shown underneath the cell and appear invisible.
*/
const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = 
    <>
      <div className ="action-bar-wrapper">
        <ActionBar id={cell.id} />
      </div>
      <CodeCell cell ={cell} />
    </>

  } else {
    child = 
    <> 
      <TextEditor cell ={cell} />
      <ActionBar id={cell.id} />
    </>  
  }

  return (
    <div className="cell-list-item">
      {child}
    </div>
  )
}

export default CellListItem;