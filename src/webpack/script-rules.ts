import * as webpack from 'webpack'
import * as tsLoader from 'ts-loader'
import * as ts from 'typescript'
import transformImportFactory from '../transform/ts-import-factory'
import transformReactMemo from '../transform/ts-react-memo'

export default function makeScriptRules(context: string): webpack.RuleSetRule[] {
  return [{
    test: /\.tsx?/,
    use: [{
      loader: require.resolve('ts-loader'),
      options: makeTSLoaderOptions(context)
    }]
  }]
}

export function makeTSLoaderOptions(context: string): Partial<tsLoader.Options> {
  return {
    context,
    transpileOnly: true,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext
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