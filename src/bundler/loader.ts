import * as webpack from 'webpack'
import { Options as TSLoaderOptions } from 'ts-loader'
import { Options as BabelLoaderOptions } from 'babel-loader'
import { Options as StyleLoaderOptions } from 'style-loader'
import { Options as CssLoaderOptions } from 'css-loader'
import { Options as SassLoaderOptions } from 'sass-loader'
import { Options as PostcssLoaderOptions } from 'postcss-loader'

export const enum Loader {
  TS = 'ts',
  Babel = 'babel',
  Style = 'style',
  Css = 'css',
  Sass = 'sass',
  Postcss = 'postcss'
}

interface LoaderOptions {
  [Loader.TS]: Partial<TSLoaderOptions>
  [Loader.Babel]: BabelLoaderOptions
  [Loader.Style]: StyleLoaderOptions
  [Loader.Css]: CssLoaderOptions
  [Loader.Sass]: SassLoaderOptions
  [Loader.Postcss]: PostcssLoaderOptions
}

export function createLoaderUse<T extends Loader, O extends LoaderOptions[T]>(loader: T, options?: O): webpack.RuleSetUseItem {
  return {
    loader: require.resolve(loader + '-loader'),
    options: options || {}
  }
}