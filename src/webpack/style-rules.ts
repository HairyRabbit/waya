import * as webpack from 'webpack'
import * as postcssSyntaxScss from 'postcss-scss'
import * as postcssPresetEnv from 'postcss-preset-env'
import * as path from 'path'
import * as files from './controlled-files.json'

const enum StyleLoader { Style = 'style', Css = 'css', Sass = 'sass', Postcss = 'postcss' }

const StyleLoaders: ReadonlyArray<StyleLoader> = [
  StyleLoader.Style, 
  StyleLoader.Css,
  StyleLoader.Sass,
  StyleLoader.Postcss
]

const Loader: { [K in StyleLoader]: string } = StyleLoaders.reduce((acc, name) => {
  acc[name] = require.resolve(`${name}-loader`)
  return acc
}, Object.create(null))


export default function makeStyleRules(context: string): webpack.RuleSetRule[] {
  const styles = files.style.map(fileName => path.resolve(context, fileName))
  const cssvar = path.resolve(context, files.cssvar[0])
  const test = /s?css$/
  
  return [{
    test,
    include: styles,
    use: makeGlobalRules()
  },{
    test,
    exclude: styles,
    use: makeNormaleRules()
  },{
    test: cssvar,
    type: 'javascript/auto',
    use: makeRootCssVariableRules()
  }]
}

export function makeRootCssVariableRules(): webpack.RuleSetUseItem[] {
  return [
    ...makeGlobalRules(3),
    {
      loader: require.resolve('./root-cssvar-loader'),
      options: {}
    },
    // {
    //   loader: require.resolve('json-loader')
    // }
  ]
}

export function makeGlobalRules(loaders: number = 2): webpack.RuleSetUseItem[] {
  return [{
    loader: Loader.style,
    options: {}
  },{
    loader: Loader.css,
    options: {
      sourceMap: true,
      importLoaders: loaders
    }
  },{
    loader: Loader.sass,
    options: {
      sourceMap: true
    }
  },{
    loader: Loader.postcss,
    options: {
      syntax: postcssSyntaxScss,
      sourceMap: true,
      plugins: [
        postcssPresetEnv()
      ]
    }
  }]
}

export function makeNormaleRules(): webpack.RuleSetUseItem[] {
  return [{
    loader: Loader.style,
    options: {}
  },{
    loader: Loader.css,
    options: {
      sourceMap: true,
      importLoaders: 2
    }
  },{
    loader: Loader.sass,
    options: {
      sourceMap: true
    }
  }]
}