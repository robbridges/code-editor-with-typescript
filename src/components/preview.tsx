import './preview.css'
import {useEffect, useRef} from 'react';

interface PreviewProps {
  code: string;
  bundlingStatus: string;
}
/* this is our inner HTML screen, we are basically sneaking this past esbuild as it really wants a file system, and refuses to return a css file without without it.
  It essentially evaluates the data sent to the it by the plugin, and throws an error with the help of babel if there is an error. It also throws the error message
  into the i-frame. Right now it only handles syncrohnous errors, working on fixing shortly to be a more useful error handler. 
*/
const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = (err) => {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
            console.error(err);
          };

          window.addEventListener('error', (event) => {
            event.preventDefault();
            handleError(event.error);
          });

          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              handleError(err);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, bundlingStatus }) => {
  const iframe = useRef<any>();
    
  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
    
  }, [code]);

  return (
  <div className = "preview-wrapper">
    <iframe
    style={{backgroundColor: 'white' }} 
    ref={iframe} 
    title="code-iframe" 
    sandbox="allow-scripts" 
    srcDoc={html} />
    {bundlingStatus && <div className="preview-error">{bundlingStatus}</div>}
  </div>
  );
};

export default Preview;