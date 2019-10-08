import * as path from 'path'
import * as webpack from 'webpack'
import { Program } from 'typescript'
import { Loader, createLoaderUse, transformImportFactory, transformReactMemo } from 'waya-core'

const TSConfig = path.join(__dirname, 'default-tsconfig.json')

interface Options {
  readonly context: string
}

export default function createScriptConfig({ context }: Options): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.tsx?$/,
        use: [
          createLoaderUse(Loader.TS, {
            context,
            transpileOnly: true,
            configFile: TSConfig,
            getCustomTransformers: (program: Program) => {
              return {
                before: [
                  transformImportFactory(`react`, `React`),
                  // transformRH({}) as any
                ],
                after: [
                  transformReactMemo(program.getTypeChecker())
                ]
              }
            }
          })
        ]
      }]
    }
  }
}