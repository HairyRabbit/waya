///<reference path="../types/postcss-scss.d.ts" />
///<reference path="../types/postcss-preset-env.d.ts" />

import * as webpack from 'webpack'
import * as postcssSyntaxScss from 'postcss-scss'
import * as postcssPresetEnv from 'postcss-preset-env'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import { Loader, createLoaderUse } from 'waya-core'

interface Options {
  readonly context: string
  readonly globals: string
  readonly cssvar: string
}

function makeRootCssVariableRules(): webpack.RuleSetUseItem[] {
  const globalUses = createGlobalStyleUses()
  globalUses.push({
    loader: require.resolve('./root-cssvar-loader')
  })
  return globalUses
}

function createGlobalStyleUses(): webpack.RuleSetUseItem[] {
  const rules: webpack.RuleSetUseItem[] = []
  rules.push(createLoaderUse(Loader.Postcss, { 
    sourceMap: true,
    syntax: postcssSyntaxScss,
    plugins: [
      postcssPresetEnv()
    ]
  }))
  rules.push(createLoaderUse(Loader.Sass, {
    // webpackImporter: false,
    sourceMap: true
  }))

  rules.push(createLoaderUse(Loader.Css, {
    sourceMap: true,
    importLoaders: rules.length
  }))

  rules.push(MiniCssExtractPlugin.loader)
  return rules.reverse().slice()
}

function createModuleStyleUses(): webpack.RuleSetUseItem[] {
  const rules: webpack.RuleSetUseItem[] = []
  rules.push(createLoaderUse(Loader.Sass, {
    sourceMap: true
  }))
  rules.push(createLoaderUse(Loader.Css, { 
    importLoaders: rules.length,
    modules: true,
    sourceMap: true 
  }))
  rules.push(MiniCssExtractPlugin.loader)
  return rules.reverse().slice()
}

export default function createStyleConfig({ globals, cssvar }: Options): webpack.Configuration {
  const test = /s?css$/

  return {
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: [ 'default', { discardComments: { removeAll: true } }],
          }
        })
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
      })
    ],
    module: {
      rules: [{
        test,
        include: globals,
        use: createGlobalStyleUses()
      },{
        test,
        exclude: globals,
        use: createModuleStyleUses()
      },{
        test: cssvar,
        type: 'javascript/auto',
        use: makeRootCssVariableRules()
      }]
    }
  }
}