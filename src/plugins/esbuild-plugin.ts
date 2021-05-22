import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});



//esbuild plugin 
export const unpkgPathPlugin = (inputCode: string) => {
  return {
    //name really only for debug purposes only in the event multiple plugins
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // hijacks or overrides ESBuilds natural process on finding out where a file is stored So far we are using a catch all filter for any file, but this will likely change
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // if the returned file contains a import state './' we need to combine the urls together, otherwise the response will be to another url entirely
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            //combine a new url with the two arguments, and get the href property from the object.
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href,
          };
        }

        // this only works if the unpkg path leads direct to an export statement
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        } 
        
        
      });

      // hi jacks the process of building that file. 
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        // we are overriding ES build trying to look up the file in the file system.
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode,
          };
        }

        //check to see if the file is stored in our local forage, IE if the key value is already stored in the cache
        // if it is return immediately.
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        if (cachedResult) {
          return cachedResult;
        }

        const { data, request } = await axios.get(args.path);

        //store resonse in cache
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        //store resonse in cache
        await fileCache.setItem(args.path, result);

        return result;

      });
    },
  };
};