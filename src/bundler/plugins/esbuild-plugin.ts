import * as esbuild from 'esbuild-wasm';




//esbuild plugin hijacks or overrides ESBuilds natural process on finding out where a file is stored we are using multiple filters, essentially only stopping once we find index.js
export const unpkgPathPlugin = () => {
  return {
    //handle root entry file of index.js
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {

      build.onResolve({filter: /(^index\.js$)/ }, () => {
        return {
          path: 'index.js',
          namespace: 'a'
        }
      });

      // weird Regex below, it essentially is looking if we can find the file path './' We are handling realitive paths in the module
      build.onResolve({filter: /^\.+\//}, (args: any) => {
        // if the returned file contains a import state './' we need to combine the urls together, otherwise the response will be to another url entirely
        return {
          namespace: 'a',
          //combine a new url with the two arguments, and get the href property from the object.
          path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href,
        };
      })

      // handle main file of a module. 
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // this only works if the unpkg path leads direct to an export statement
        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        } 
      });
    },
    
  };
};