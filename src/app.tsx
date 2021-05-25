import 'bulmaswatch/superhero/bulmaswatch.min.css';

import { useState } from 'react';

import CodeEditor from './components/code-editor';
import Preview from './components/preview';
import bundler from './bundler/index';


const App = () => {
  const [code, setCode] = useState('');
  const [input, setInput] =useState('Enter Text Here');
  const onClick = async () => {
    const output = await bundler(input);
    setCode(output);
  };
  
  

  return (
  <div>
    <CodeEditor initialValue="const a = 1;"
    onChange={(value) => setInput(value)} />
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <Preview code={code} />
  </div>
  );
};


export default App;