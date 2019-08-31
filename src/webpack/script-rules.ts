import * as webpack from 'webpack'
import * as tsLoader from 'ts-loader'
import * as babelLoader from 'babel-loader'
import * as ts from 'typescript'
import transformImportFactory from '../transform/ts-import-factory'
import transformReactMemo from '../transform/ts-react-memo'
import './tsconfig.json'

const TSConfig = require.resolve('./_tsconfig.json')

export default function makeScriptRules(context: string, isProduction: boolean = false): webpack.RuleSetRule[] {
  const use = []

  if(isProduction) use.push({
    loader: require.resolve('babel-loader'),
    options: makeBabelLoaderOptions()
  })

  use.push({
    loader: require.resolve('ts-loader'),
    options: makeTSLoaderOptions(context)
  })

  return [{ test: /\.tsx?/, use }]
}

export function makeTSLoaderOptions(context: string): Partial<tsLoader.Options> {
  return {
    context,
    transpileOnly: true,
    configFile: TSConfig,
    getCustomTransformers: (program: ts.Program) => {
      return {
        before: [
          transformImportFactory(`react`, `React`)
        ],
        after: [
          transformReactMemo(program.getTypeChecker())
        ]
      }
    }
  }
}

export function makeBabelLoaderOptions(): Partial<babelLoader.Options> {
  return {
    presets: [
      [require.resolve('@babel/preset-env'), {
        debug: true,
        modules: false,
        targets: {
          browsers: 'last 2 versions'
        },
        useBuiltIns: 'usage',
        loose: true,
        corejs: { version: 3, proposals: true }
      }],
      require.resolve('@babel/preset-react'),
      require.resolve('@babel/preset-typescript')
    ],
    plugins: [
      require.resolve('@babel/plugin-transform-runtime')
    ]
  }
}