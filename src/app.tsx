import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';


const App = () => {
  const ref = useRef<any>();
  const [input, setInput] =useState('Enter Text Here');
  const [code, setCode]= useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
    
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = () => {
    if (!ref.current) {
      return;
    }

    console.log(ref.current);
  }

  return (
  <div>
    <textarea onChange={e => setInput(e.target.value) } value={input}></textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>
    )
}

export default App;