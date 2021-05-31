import { useState, useEffect } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler/index';
import Resizable from './resizeable';
import {Cell} from '../redux-state';
import { useActions } from '../hooks/use-actions';


interface CodeCellProps {
  cell: Cell;
}


const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const { updateCell } = useActions();
  
  /* 
  we are bouncing our bunding of the user code. What this is doing is watching for any updates to input ( when the user types some more characters) If a whole second passes
  without any further updates to input (no more key presses from user) for a whole 1 second it will then bundle the input. 
  If the user presses another keypress within a second it resets timer 
  This is much more ideal then bundling with every key press Laptop users will thank us.   
  */
  useEffect(() => {
    const timer = setTimeout( async() => {
      const output = await bundler(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content] );
  
  
  
  
  
  // this is a single code cell instance, we are throwing in two resizable boxes, for for width, one for height, displaying the Monaco Code Editor, and the preview iframe. 
  return (
  <Resizable direction="vertical">
    <div style={{ height: '100%', display: 'flex', flexDirection: 'row'}}>
      <Resizable direction="horizontal">
      <CodeEditor initialValue={cell.content}
      onChange={(value) => updateCell(cell.id, value)} />
      </Resizable>
      <Preview  code={code} bundlingStatus={err} />
    </div>
  </Resizable>
  );
};

export default CodeCell; 