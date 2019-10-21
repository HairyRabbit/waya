/**
 * webpack-contrib/sass-loader
 * @see https://github.com/webpack-contrib/sass-loader
 * @version 8.0.0
 */
declare module 'sass-loader' {
  import * as webpack from 'webpack'
  import * as NodeSass from 'node-sass'
  import * as DartSass from 'sass'

  type SassOptions<T extends SassLibrary>
    = T extends SassLibrary.NodeSass
    ? NodeSass.Options
    : T extends SassLibrary.DartSass
    ? DartSass.Options
    : never

  type SassImplementation<T extends SassLibrary>
    = T extends SassLibrary.NodeSass
    ? typeof NodeSass
    : T extends SassLibrary.DartSass
    ? typeof DartSass
    : never

  const enum SassLibrary {
    NodeSass = 'node-sass',
    DartSass = 'sass'
  }

  export interface Options<T extends SassLibrary = SassLibrary.NodeSass> {
    /**
     * The special `implementation` option determines which implementation of Sass to use.
     */
    implementation?: SassImplementation<T>
    /**
     * Options for [Node Sass](https://github.com/sass/node-sass/#options) or [Dart Sass](https://github.com/sass/dart-sass#javascript-api) implementation.
     */
    sassOptions?: SassOptions<T> | ((loaderContext: webpack.loader.LoaderContext) => SassOptions<T>)
    /**
     * Prepends `Sass`/`SCSS` code before the actual entry file. In this case, the `sass-loader` will not override the data option but just append the entry's content.
     */
    prependData?: string | ((loaderContext: webpack.loader.LoaderContext) => string)
    /**
     * Enables/Disables generation of source maps.
     * @default typeof compiler.devtool
     */
    sourceMap?: boolean
    /**
     * Enables/Disables default webpack importer.
     * @default true
     */
    webpackImporter?: boolean
  }
}

