/**
 * webpack-contrib/css-loader
 * @see https://github.com/webpack-contrib/css-loader
 * @version 3.2.0
 */
declare module "css-loader" {
  import * as webpack from 'webpack'
  /**
   * Style of exported classnames.
   */
  const enum LocalsConvention {
    /**
     * Class names will be exported as is.
     */
    AsIs = 'asIs',
    /**
     * Class names will be camelized, the original class name will not to be removed from the locals
     */
    CamelCase = 'camelCase',
    /**
     * Class names will be camelized, the original class name will be removed from the locals
     */
    CamelCaseOnly = 'camelCaseOnly',
    /**
     * Only dashes in class names will be camelized
     */
    Dashes = 'dashes',
    /**
     * Dashes in class names will be camelized, the original class name will be removed from the locals
     */
    DashesOnly = 'dashesOnly'
  }

  /**
   * Setup mode option. You can omit the value when you want local mode.
   */
  const enum ModulesMode {
    Local = 'local',
    Global = 'global'
  }

  /**
   * Enable CSS Modules features and setup options for them.
   */
  interface ModulesOptions {
    /**
     * Setup mode option. You can omit the value when you want `local` mode.
     * @default ModulesMode.Local
     */
    mode?: ModulesMode
    /**
     * You can configure the generated ident with the `localIdentName` query parameter. See [loader-utils's documentation](https://github.com/webpack/loader-utils#interpolatename) for more information on options.
     * @default '[hash:base64]'
     */
    localIdentName?: string
    /**
     * Allow to redefine basic loader context for local ident name. By default we use `rootContext` of loader.
     */
    context?: string
    /**
     * Allow to add custom hash to generate more unique classes.
     */
    hashPrefix?: string
    /**
     * You can also specify the absolute path to your custom `getLocalIdent` function to generate classname based on a different schema. By default we use built-in function to generate a classname.
     * 
     * @param loaderContext the webpack loader context
     * @param localIdentName local ident name
     * @param localName local name
     * @param options options pass to `loaderUtils.interpolateName`
     */
    getLocalIdent?(loaderContext: webpack.loader.LoaderContext, localIdentName: string, localName: string, options: { context?: string, content?: string, regExp?: RegExp }): string | false | null | undefined
    localIdentRegExp?: string | RegExp
  }

  export interface Options {
    /**
     * Enables/Disables url/image-set functions handling
     * @default true
     */
    url?: boolean | ((url: string, resourcePath: string) => boolean)
    /**
     * Enables/Disables `@import` at-rules handling
     * @default true
     */
    import?: boolean | ((parsedImport: string, resourcePath: string) => boolean)
    /**
     * Enables/Disables CSS Modules and their configuration
     * @default false
     */
    modules?: boolean | ModulesMode | ModulesOptions
    /**
     * Enables/Disables generation of source maps
     * @default false
     */
    sourceMap?: boolean
    /**
     * Enables/Disables or setups number of loaders applied before CSS loader
     * @default 0
     */
    importLoaders?: number
    /**
     * Style of exported classnames
     * @default LocalsConvention.AsIs
     */
    localsConvention?: LocalsConvention
    /**
     * Export only locals
     * @default false
     */
    onlyLocals?: boolean
  }
}