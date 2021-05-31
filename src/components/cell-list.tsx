import { Fragment } from 'react';
import { useTypedSelector,} from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';

// our group cell list, this contains and renders each cell that we currently have in state
const CellList: React.FC = () => {
  const cells = useTypedSelector(({cells: {order, data } }) => {
    return order.map((id) => {
      return data[id];
    });
  });

  const renderedCells = cells.map(cell => 
    (
      <Fragment key={cell.id} >
        <AddCell nextCellId={cell.id} />
        <CellListItem  cell={cell} />
      </Fragment>
    ));

  return ( 
  <div>
    {renderedCells}
    <AddCell nextCellId={null} />
  </div>
  )
}

export default CellList;