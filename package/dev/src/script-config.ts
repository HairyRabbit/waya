import * as path from 'path'
import * as webpack from 'webpack'
import { Program } from 'typescript'
import { Loader, LoaderOptions, createLoaderUse, transformImportFactory, transformReactMemo } from 'waya-core'
import './default-tsconfig.json'

export const DEFAULT_TSCONFIG = path.join(__dirname, 'default-tsconfig.json')

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
    }
  }
}