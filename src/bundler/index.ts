import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin }  from './plugins/esbuild-plugin'
import { fetchPlugin } from './plugins/fetch-plugin';

let service: esbuild.Service;
// this is our builder. It makes sure that the service is set up, and returns the code that is actually built in with the esbuild plugin or returned from fetch plugion
const bundler = async (rawCode: string) => {
  if (!service) {
    service =await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  }
  //passes the code along  to the code cell terminal which actually houses our web based code editor and preview iframe
  try 
  {
    const result = await service.build({
      entryPoints:['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(rawCode),
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
      jsxFactory: '_React.createElement',
      jsxFragment: '_React.Fragment'
  });
  
  return {
    code: result.outputFiles[0].text,
    err: '',
  } 
} catch (err) {
  return {
    code: '',
    err: err.message, 
  }

}

};

export default bundler;