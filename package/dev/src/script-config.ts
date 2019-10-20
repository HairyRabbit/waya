import * as webpack from 'webpack'
import { Program } from 'typescript'
import { DEFAULT_TSCONFIG, Loader, LoaderOptions, createLoaderUse, transformImportFactory, transformReactMemo } from 'waya-core'

export interface createScriptConfigOptions {
  readonly context: string
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

export default function createScriptConfig({ context }: createScriptConfigOptions): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [ createScriptLoaderUse(context) ]
      }]
    },
    stats: {
      warningsFilter: /export .* was not found in/
    }
  }
}