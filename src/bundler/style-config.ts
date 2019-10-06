import * as webpack from 'webpack'
import * as postcssSyntaxScss from 'postcss-scss'
import * as postcssPresetEnv from 'postcss-preset-env'
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin'
import * as OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import * as path from 'path'
import * as files from './controlled-files.json'
import * as loaderUtils from 'loader-utils'
import { Loader, createLoaderUse } from './loader'

function makeRootCssVariableRules(isBuild: boolean = false): webpack.RuleSetUseItem[] {
  const globalUses = createGlobalStyleUses(isBuild)
  globalUses.push({
    loader: require.resolve('./root-cssvar-loader')
  })
  return globalUses
}

function createGlobalStyleUses(isBuild: boolean = false): webpack.RuleSetUseItem[] {
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

  rules.push(!isBuild ? createLoaderUse(Loader.Style) : MiniCssExtractPlugin.loader)
  return rules.reverse().slice()
}

function createModuleStyleUses(isBuild: boolean = false): webpack.RuleSetUseItem[] {
  const rules: webpack.RuleSetUseItem[] = []
  rules.push(createLoaderUse(Loader.Sass, {
    sourceMap: true
  }))
  rules.push(createLoaderUse(Loader.Css, { 
    importLoaders: rules.length,
    modules: {
      localIdentName: '[path][local]-[hash:base64:5]',
      getLocalIdent: overrideLibraryClassName
    },
    sourceMap: true 
  }))
  rules.push(!isBuild ? createLoaderUse(Loader.Style) : MiniCssExtractPlugin.loader)
  return rules.reverse().slice()
}

function overrideLibraryClassName(
  loaderContext: webpack.loader.LoaderContext, 
  localIdentName: string, 
  localName: string, 
  options: any
): string {
  if (!options.context) {
    options.context = loaderContext.rootContext || '.'
  }

  const request = path.relative(options.context, loaderContext.resourcePath).replace(/\\/g, '/')
  options.content = `${options.hashPrefix + request} + ${unescape(localName)}`
  localIdentName = localIdentName.replace(/\[local\]/gi, localName)

  const hash = loaderUtils.interpolateName(loaderContext, localIdentName, options)
  const ret = hash.replace(new RegExp('[^a-zA-Z0-9\\-_\u00A0-\uFFFF]', 'g'), '@').replace(/^((-?[0-9])|--)/, '_$1')

  // /^(node_modules|_+)/
  if(!/^node_modules/.test(ret)) return ret.replace(/@/g, '-')
  const arr = ret.split('@')
  arr.shift()
  // const moduleName = arr[0]
  /* @todo module alias */
  return '~' + arr.join('-')
}

interface Options {
  isBuild?: boolean
}

// function recurIssuer(mod: any): string | null {
//   console.log(mod.constructor.name)
//   if (mod.issuer) return recurIssuer(mod.issuer)
//   else if (mod.name) return mod.name
//   else return null
// }

function createBuildStyleConfig(context: string): webpack.Configuration {
  const styles = files.style.map(fileName => path.resolve(context, fileName))
  const cssvar = path.resolve(context, files.cssvar[0])
  const test = /s?css$/

  return {
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            enforce: true,
          },
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'all',
            priority: 1000,
            enforce: true
          },
          
        },
      },
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
        include: styles,
        use: createGlobalStyleUses(true)
      },{
        test,
        exclude: styles,
        use: createModuleStyleUses(true)
      },{
        test: cssvar,
        type: 'javascript/auto',
        use: makeRootCssVariableRules(true)
      }]
    }
  }
}

function createDevStyleConfig(context: string): webpack.Configuration {
  const styles = files.style.map(fileName => path.resolve(context, fileName))
  const cssvar = path.resolve(context, files.cssvar[0])
  const test = /s?css$/
  
  return {
    module: {
      rules: [{
        test,
        include: styles,
        use: createGlobalStyleUses()
      },{
        test,
        exclude: styles,
        use: createModuleStyleUses()
      },{
        test: cssvar,
        type: 'javascript/auto',
        use: makeRootCssVariableRules()
      }]
    }
  }
}

export default function createStyleConfig(context: string, options: Options = {}) {
  return !options.isBuild 
    ? createDevStyleConfig(context) 
    : createBuildStyleConfig(context)
}