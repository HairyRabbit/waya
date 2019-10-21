/**
 * postcss/postcss-loader
 * @see https://github.com/postcss/postcss-loader
 * @version 3.0.0
 */
declare module 'postcss-loader' {
  import * as webpack from 'webpack'
  // import * as postcss from 'postcss'
  interface Context {
    /**
     * process.env.NODE_ENV
     * @default 'development''
     */
    env?: string,
    file?: object,
    options?: object
  }

  export interface Options {
    /**
     * Enable PostCSS Parser support in CSS-in-JS
     */
    exec?: boolean
    /**
     * Set PostCSS Parser
     */
    parser?: string | Function
    /**
     * Set PostCSS Syntax
     */
    syntax?: string | Function
    /**
     * Set PostCSS Stringifier
     */
    stringifier?: string | Function
    /**
     * Set postcss.config.js config path && ctx
     */
    config?: {
      /**
       * You can manually specify the path to search for your config (`postcss.config.js`) with the config.path option. This is needed if you store your config in a separate e.g `./config` || `./.config` folder.
       */
      path?: string,
      context?: { [key: string]: Context },
      ctx?: { [key: string]: Context }
    }
    /**
     * Set PostCSS Plugins
     * @default []
     */
    plugins?: Function[] | ((loader: webpack.loader.LoaderContext) => Function[])
    /**
     * Enable Source Maps
     * @default false
     */
    sourceMap?: string | boolean
  }
}