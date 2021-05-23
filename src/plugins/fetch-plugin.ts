import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      // we are overriding ES build trying to look up the file in the file system.
      if (args.path === 'index.js') {
        return {
          loader: 'jsx',
          contents: inputCode,
        };
      }
    
      //check to see if the file is stored in our local forage, IE if the key value is already stored in the cache
      // if it is return immediately.
      // const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
    
      // if (cachedResult) {
      //   return cachedResult;
      // }
    
      const { data, request } = await axios.get(args.path);
      // this does not work.. need to figure out why...
      const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';

      // we are going to try to directly inport the css file with some javascript. 
      const contents = fileType === 'css' 
      ? `
        const style = document.createElement('style');
        style.innerText = 'body {background-color: "red"}';
        document.head.appendChild(style);
      `
       : data;

      //store resonse in cache
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents,
        resolveDir: new URL('./', request.responseURL).pathname,
      };
    
      //store resonse in cache
      await fileCache.setItem(args.path, result);
    
      return result;
    
    });
    }
  }
}

// hi jacks the process of building that file. 

