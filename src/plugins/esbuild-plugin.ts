import * as esbuild from 'esbuild-wasm';
import axios from 'axios';

//esbuild plugin 
export const unpkgPathPlugin = () => {
  return {
    //name really only for debug purposes only in the event multiple plugins
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // hijacks or overrides ESBuilds natural process on finding out where a file is stored So far we are using a catch all filter for any file, but this will likely change
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        } else if (args.path ==='tiny-test-pkg') {
          return { path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js', namespace: 'a'}
        }
        
      });

      // hi jacks the process of building that file. 
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        // we are overriding ES build trying to look up the file in the file system.
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'tiny-test-pkg';
              console.log(message);
            `,
          };
        }
        const { data } = await axios.get(args.path)
        return {
          loader: 'jsx',
          contents: data
        }
      });
    },
  };
};