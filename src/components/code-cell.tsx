import './code-cell.css';

import { useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizeable';
import {Cell} from '../redux-state';
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useCumulativeCode } from '../hooks/use-cumulative-code';


interface CodeCellProps {
  cell: Cell;
}


const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {

  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector((state) => state.bundles[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  

  
  
  
  /* 
  we are bouncing our bunding of the user code. What this is doing is watching for any updates to input ( when the user types some more characters) If a whole second passes
  without any further updates to input (no more key presses from user) for a whole 1 second it will then bundle the input. 
  If the user presses another keypress within a second it resets timer 
  This is much more ideal then bundling with every key press Laptop users will thank us.   
  */
  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode)
      return;
    }

    const timer = setTimeout( async() => {
      createBundle(cell.id, cumulativeCode)

    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    /* we had to disable the warning here, it wanted to add bundle to the dependency array, and that would require it update everytime bundle was updated. So it would be 
    an infinite loop, always updating bundle and always running. Our program would crash. We had to create bundle at the top so that the preview frames were always shown, since we
    edited our preview code windows below to only show when there was a bundle.
    */
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cumulativeCode, cell.id, createBundle]);
  
  
  
  
  
  // this is a single code cell instance, we are throwing in two resizable boxes, for for width, one for height, displaying the Monaco Code Editor, and the preview iframe. 
  return (
  <Resizable direction="vertical">
    <div style={{ height: 'calc(100% - 8px)', display: 'flex', flexDirection: 'row'}}>
      <Resizable direction="horizontal">
        <CodeEditor initialValue={cell.content}
        onChange={(value) => updateCell(cell.id, value)} />
      </Resizable>
      {
        
        !bundle || bundle.loading ? (
        <div className="progress-wrapper">   
          <div className="progress-cover">
            <progress className="progress is-small is-primary" max="100">
              Loading
            </progress>
          </div>
        </div>
        ) : ( <Preview  code={bundle.code} bundlingStatus={bundle.error} />
        )}
      
    </div>
  </Resizable>
  );
};

export default CodeCell; 