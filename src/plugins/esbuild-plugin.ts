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
        }
        // if the returned file contains a import state './' we need to combine the urls together, otherwise the response will be to another url entirely
        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(args.path, args.importer + '/').href,
          };
        }
        // this only works if the unpkg path leads direct to an export statement
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        } 
        //  else if (args.path ==='tiny-test-pkg') {
        //   return { path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js', namespace: 'a'}
        // }
        
      });

      // hi jacks the process of building that file. 
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
        // we are overriding ES build trying to look up the file in the file system.
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('medium-test-pkg');
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