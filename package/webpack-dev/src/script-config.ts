import * as webpack from 'webpack'
import { Program } from 'typescript'
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { DEFAULT_TSCONFIG, Loader, LoaderOptions, createLoaderUse, transformImportFactory, transformReactMemo } from 'waya-shared'

export interface ScriptConfigOptions {
  context: string
}

export function createScriptLoaderUse(context: string, options: LoaderOptions[Loader.TS] = {}) {
  return createLoaderUse(Loader.TS, {
    ...options,
    context,
    transpileOnly: true,
    configFile: DEFAULT_TSCONFIG,
    getCustomTransformers: (program: Program) => {
      return {
        before: [
          transformImportFactory(`react`, `React`)
        ],
        after: [
          transformReactMemo(program.getTypeChecker())
        ]
      }
    }
  })
}

export function createScriptConfig({ context }: ScriptConfigOptions): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [ createScriptLoaderUse(context) ]
      }]
    },
    stats: {
      warningsFilter: /export .* was not found in/
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin()
    ]
  }
}

export default createScriptConfig