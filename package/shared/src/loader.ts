///<reference path="../types/babel-loader.d.ts" />
///<reference path="../types/style-loader.d.ts" />
///<reference path="../types/css-loader.d.ts" />
///<reference path="../types/sass-loader.d.ts" />
///<reference path="../types/postcss-loader.d.ts" />
///<reference path="../types/url-loader.d.ts" />
///<reference path="../types/file-loader.d.ts" />
///<reference path="../types/svgr__webpack.d.ts" />

import * as webpack from 'webpack'
import { Options as TSLoaderOptions } from 'ts-loader'
import { Options as BabelLoaderOptions } from 'babel-loader'
import { Options as StyleLoaderOptions } from 'style-loader'
import { Options as CssLoaderOptions } from 'css-loader'
import { Options as SassLoaderOptions } from 'sass-loader'
import { Options as PostcssLoaderOptions } from 'postcss-loader'
import { Options as UrlLoaderOptions } from 'url-loader'
import { Options as FileLoaderOptions } from 'file-loader'
import { Options as SVGLoaderOptions } from '@svgr/webpack'

export const enum Loader {
  TS = 'ts-loader',
  Babel = 'babel-loader',
  Style = 'style-loader',
  Css = 'css-loader',
  Sass = 'sass-loader',
  Postcss = 'postcss-loader',
  Url = 'url-loader',
  File = 'file-loader',
  Yaml = 'yaml-loader',
  SVG = '@svgr/webpack'
}

export interface LoaderOptions {
  [Loader.TS]: Partial<TSLoaderOptions>
  [Loader.Babel]: BabelLoaderOptions
  [Loader.Style]: StyleLoaderOptions
  [Loader.Css]: CssLoaderOptions
  [Loader.Sass]: SassLoaderOptions
  [Loader.Postcss]: PostcssLoaderOptions
  [Loader.Url]: UrlLoaderOptions
  [Loader.File]: FileLoaderOptions
  [Loader.Yaml]: {}
  [Loader.SVG]: SVGLoaderOptions
}

export function createLoaderUse<T extends Loader>(loader: T, options?: LoaderOptions[T]): webpack.RuleSetUseItem {
  const use = Object.create(null)
  use.loader = require.resolve(loader)
  if(options) use.options = options
  return use
}