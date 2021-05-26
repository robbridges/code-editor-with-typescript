import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

// create the fileCache with Local forage, this expands on the local storage that a website might offer. NOTE NOT SUPPORTED IN ALL BROWSERS. Will revert to localStorage if it isn't
const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {

    build.onLoad({filter: /^index.js$/}, () => {
      return {
        loader: 'jsx',
        contents: inputCode,
      };
    });

    /* 
    we technically do not have to return any file on an onload function ES build will assume it is a false call and move right on along. 
    It will then fall through into our other checks that do return something, we can abstract out the cached result shared code between css on load and Javascript on load files
    
    */
    build.onLoad({filter: /.*/}, async (args:any) => {
           //check to see if the file is stored in our local forage, IE if the key value is already stored in the cache
      // if it is return immediately.
      const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
    
      if (cachedResult) {
        return cachedResult;
      }
      
    });
    
    build.onLoad({filter: /.css$/}, async (args: any) => {
      //check to see if the file is stored in our local forage, IE if the key value is already stored in the cache
      // if it is return immediately.
      
      const { data, request } = await axios.get(args.path);
      

      // we need to escape any new lines, double quotes or single quotes and replace so that no new script tag or new lines can mess up our code
      const escaped = data
      .replace(/\n/g, '')
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'")

      // we are going to try to directly inport the css file with some javascript. This will not work if the css has import statements or font files.. exct. For now good enough!
      const contents =  `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style);
      `;
      

      //store resonse in cache
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents,
        resolveDir: new URL('./', request.responseURL).pathname,
      };
    
      //store response in cache
      await fileCache.setItem(args.path, result);
    
      return result;
    });
      
    build.onLoad({ filter: /.*/ }, async (args: any) => {
      // we are overriding ES build trying to look up the file in the file system.
      const { data, request } = await axios.get(args.path);


      //store response in cache
      const result: esbuild.OnLoadResult = {
        loader: 'jsx',
        contents: data,
        resolveDir: new URL('./', request.responseURL).pathname,
      };
    
      //store response in cache
      await fileCache.setItem(args.path, result);
    
      return result;
    
    });
    }
  }
}



