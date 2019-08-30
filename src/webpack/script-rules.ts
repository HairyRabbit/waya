import * as webpack from 'webpack'
import * as tsLoader from 'ts-loader'
import * as ts from 'typescript'
import transformImportFactory from '../transform/ts-import-factory'
import transformReactMemo from '../transform/ts-react-memo'
import './tsconfig.json'

const TSConfig = require.resolve('./tsconfig.json')

export default function makeScriptRules(context: string, isProduction: boolean = false): webpack.RuleSetRule[] {
  const uses = []
  const tsUse = {
    loader: require.resolve('ts-loader'),
    options: makeTSLoaderOptions(context, isProduction)
  }

  if(isProduction) uses.push({
    loader: require.resolve('babel-loader'),
    options: makeBabelLoaderOptions()
  })

  uses.push(tsUse)
  return [{
    test: /\.tsx?/,
    use: uses
  }]
}

export function makeTSLoaderOptions(context: string, isProduction: boolean): Partial<tsLoader.Options> {
  const jsx: any = isProduction ? 'preserve': 'react'
  return {
    context,
    transpileOnly: true,
    configFile: TSConfig,
    compilerOptions: {
      jsx
    },
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

export function makeBabelLoaderOptions() {
  return {

  }
}