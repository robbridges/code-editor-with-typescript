import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin }  from './plugins/esbuild-plugin'


const App = () => {
  const ref = useRef<any>();
  const [input, setInput] =useState('Enter Text Here');
  const [code, setCode]= useState('');

  const startService = async () => {
  try {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
  } catch (err) {
    console.log('there was an error!');
  }
    
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.build({
      entryPoints:['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()]
    });

    //console.log(result);

    setCode(result.outputFiles[0].text);
  };

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