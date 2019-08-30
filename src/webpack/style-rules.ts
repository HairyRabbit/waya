import * as webpack from 'webpack'

const enum StyleLoader { Style = 'style', Css = 'css', Sass = 'sass', Postcss = 'postcss' }

const StyleLoaders: StyleLoader[] = [
  StyleLoader.Style, 
  StyleLoader.Css,
  StyleLoader.Sass,
  StyleLoader.Postcss
]

const Loader: { [K in StyleLoader]: string } = StyleLoaders.reduce((acc, name) => {
  acc[name] = require.resolve(`${name}-loader`)
  return acc
}, Object.create(null))


export default function makeStyleRules(globals: string[]): webpack.RuleSetRule[] {
  const test = /s?css$/
  
  return [{
    test,
    include: globals,
    use: makeGlobalRules()
  },{
    test,
    exclude: globals,
    use: makeNormaleRules()
  }]
}

export function makeGlobalRules(): webpack.RuleSetUse {
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
  },{
    loader: Loader.postcss,
    options: {
      syntax: require(`postcss-scss`),
      sourceMap: true,
      plugins: [
        require(`postcss-preset-env`)()
      ]
    }
  }]
}

export function makeNormaleRules(): webpack.RuleSetUse {
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