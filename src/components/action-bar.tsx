import './action-bar.css';

import { useActions } from '../hooks/use-actions';
import ActionButton from './action-button';

interface ActionBarProps {
  id: string;
}
// combination of our three action button buttons, pass in the className and onclick function as props. 
const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell} = useActions();


  return (
    <div className="action-bar">
      <ActionButton className={"fas fa-arrow-up"} onClick={() => moveCell(id, 'up')}/>
      <ActionButton className={"fas fa-arrow-down"} onClick={() => moveCell(id, 'down')} />
      <ActionButton className={"fas fa-times"} onClick={() => deleteCell(id)} />

    </div>
  ) 
}

export default ActionBar;