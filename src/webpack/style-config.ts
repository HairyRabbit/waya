import * as webpack from 'webpack'
import * as postcssSyntaxScss from 'postcss-scss'
import * as postcssPresetEnv from 'postcss-preset-env'
import * as path from 'path'
import * as files from './controlled-files.json'
import * as loaderUtils from 'loader-utils'
import { Loader, createLoaderUse } from './loader.js'

export default function makeStyleRules(context: string): webpack.RuleSetRule[] {
  const styles = files.style.map(fileName => path.resolve(context, fileName))
  const cssvar = path.resolve(context, files.cssvar[0])
  const test = /s?css$/
  
  return [{
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

export function makeRootCssVariableRules(): webpack.RuleSetUseItem[] {
  const globalUses = createGlobalStyleUses()
  globalUses.push({
    loader: require.resolve('./root-cssvar-loader')
  })
  return globalUses
}

export function createGlobalStyleUses(): webpack.RuleSetUseItem[] {
  const rules: webpack.RuleSetUseItem[] = []
  rules.push(createLoaderUse(Loader.Postcss, { 
    sourceMap: true,
    syntax: postcssSyntaxScss,
    plugins: [
      postcssPresetEnv()
    ]
  }))
  rules.push(createLoaderUse(Loader.Sass, {
    sourceMap: true
  }))

  rules.push(createLoaderUse(Loader.Css, {
    sourceMap: true,
    importLoaders: rules.length
  }))

  rules.push(createLoaderUse(Loader.Style))
  return rules.reverse().slice()
}

export function createModuleStyleUses(): webpack.RuleSetUseItem[] {
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
  rules.push(createLoaderUse(Loader.Style))
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