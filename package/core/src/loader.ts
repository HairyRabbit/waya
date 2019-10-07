///<reference path="../types/babel-loader.d.ts" />
///<reference path="../types/style-loader.d.ts" />
///<reference path="../types/css-loader.d.ts" />
///<reference path="../types/sass-loader.d.ts" />
///<reference path="../types/postcss-loader.d.ts" />
///<reference path="../types/url-loader.d.ts" />
///<reference path="../types/file-loader.d.ts" />

import * as webpack from 'webpack'
import { Options as TSLoaderOptions } from 'ts-loader'
import { Options as BabelLoaderOptions } from 'babel-loader'
import { Options as StyleLoaderOptions } from 'style-loader'
import { Options as CssLoaderOptions } from 'css-loader'
import { Options as SassLoaderOptions } from 'sass-loader'
import { Options as PostcssLoaderOptions } from 'postcss-loader'
import { Options as UrlLoaderOptions } from 'url-loader'
import { Options as FileLoaderOptions } from 'file-loader'

export const enum Loader {
  TS = 'ts',
  Babel = 'babel',
  Style = 'style',
  Css = 'css',
  Sass = 'sass',
  Postcss = 'postcss',
  Url = 'url',
  File = 'file'
}

interface LoaderOptions {
  [Loader.TS]: Partial<TSLoaderOptions>
  [Loader.Babel]: BabelLoaderOptions
  [Loader.Style]: StyleLoaderOptions
  [Loader.Css]: CssLoaderOptions
  [Loader.Sass]: SassLoaderOptions
  [Loader.Postcss]: PostcssLoaderOptions
  [Loader.Url]: UrlLoaderOptions
  [Loader.File]: FileLoaderOptions
}

export function createLoaderUse<T extends Loader>(loader: T, options?: LoaderOptions[T]): webpack.RuleSetUseItem {
  return {
    loader: require.resolve(loader + '-loader'),
    options: options || {}
  }
}