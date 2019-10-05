/**
 * babel/babel-loader
 * @see https://github.com/babel/babel-loader
 * @version 8.0.6
 */
import { TransformOptions } from '@babel/core'

declare module "babel-loader" {
  export interface Options extends TransformOptions {
    /**
     * When set, the given directory will be used to cache the results of the loader. Future webpack builds will attempt to read from the cache to avoid needing to run the potentially expensive Babel recompilation process on each run. If the value is set to true in options ({cacheDirectory: true}), the loader will use the default cache directory in node_modules/.cache/babel-loader or fallback to the default OS temporary file directory if no node_modules folder could be found in any root directory.
     * @default false
     */
    cacheDirectory?: boolean | string
    /**
     * Default is a string composed by the @babel/core's version, the babel-loader's version, the contents of .babelrc file if it exists, and the value of the environment variable BABEL_ENV with a fallback to the NODE_ENV environment variable. This can be set to a custom value to force cache busting if the identifier changes.
     */
    cacheIdentifier?: string
    /**
     * When set, each Babel transform output will be compressed with Gzip. If you want to opt-out of cache compression, set it to false -- your project may benefit from this if it transpiles thousands of files.
     * @default true
     */
    cacheCompression?: boolean
    /**
     * The path of a module that exports a custom callback like the one that you'd pass to .custom(). Since you already have to make a new file to use this, it is recommended that you instead use .custom to create a wrapper loader. Only use this is you must continue using babel-loader directly, but still want to customize.
     * @default null
     */
    customize?: null | Function
  }
}