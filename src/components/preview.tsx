import './preview.css'
import {useEffect, useRef} from 'react';

interface PreviewProps {
  code: string;
}
// this is our inner HTML screen, we are basically sneaking this past esbuild as it really wants a file system, and refuses to return a css file without without it. 
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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>();
    
  useEffect(() => {
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);


  return (
  <div className = "preview-wrapper">
    <iframe
    style={{backgroundColor: 'white' }} 
    ref={iframe} 
    title="code-iframe" 
    sandbox="allow-scripts" 
    srcDoc={html} />
  </div>
  );
};

export default Preview;