import { useState } from 'react';
import CodeEditor from './code-editor';
import Preview from './preview';
import bundler from '../bundler/index';
import Resizable from './resizeable';


const CodeCell = () => {
  const [code, setCode] = useState('');
  const [input, setInput] =useState('Enter Text Here');
  
  const onClick = async () => {
    const output = await bundler(input);
    setCode(output);
  };
  
  
  // this is a single code cell instance, we are throwing in two resizable boxes, for for width, one for height, displaying the Monaco Code Editor, and the preview iframe. 
  return (
  <Resizable direction="vertical">
    <div style={{ height: '100%', display: 'flex', flexDirection: 'row'}}>
      <Resizable direction="horizontal">
      <CodeEditor initialValue="const a = 1;"
      onChange={(value) => setInput(value)} />
      </Resizable>
      <Preview  code={code} />
    </div>
  </Resizable>
  );
};

export default CodeCell;