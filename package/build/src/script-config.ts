import * as path from 'path'
import * as webpack from 'webpack'
import * as TerserWebpackPlugin from 'terser-webpack-plugin'
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
          createLoaderUse(Loader.Babel, {
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
          }),
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
    },
    optimization: {
      minimizer: [
        new TerserWebpackPlugin({
          sourceMap: true
        })
      ]
    }
  }
}