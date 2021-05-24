import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin }  from './plugins/esbuild-plugin'
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';


const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] =useState('Enter Text Here');
  

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };
    
  

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints:['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input),
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    //setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  };
  
  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
              throw err;
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
  <div>
    <CodeEditor initialValue="const a = 1;"
    onChange={(value) => setInput(value)} />
    <textarea 
    onChange={e => setInput(e.target.value) } 
    value={input}
    >
    </textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <iframe ref={iframe} title="code-iframe" sandbox="allow-scripts" srcDoc={html}></iframe>
  </div>
  );
};


export default App;