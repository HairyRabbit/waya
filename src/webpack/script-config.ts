import * as webpack from 'webpack'
import * as ts from 'typescript'
import transformImportFactory from '../transform/ts-import-factory'
import transformReactMemo from '../transform/ts-react-memo'
import { Loader, createLoaderUse } from './loader'
// import transformRH = require('react-hot-ts/lib/transformer')
import './default-tsconfig.json'

const TSConfig = require.resolve('./default-tsconfig.json')


function createDevScriptConfig(context: string): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.tsx?/,
        use: createLoaderUse(Loader.TS, {
          context,
          transpileOnly: true,
          configFile: TSConfig,
          getCustomTransformers: (program: ts.Program) => {
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
      }]
    }
  }
}

function createBuildScriptConfig(context: string): webpack.Configuration {
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
            getCustomTransformers: (program: ts.Program) => {
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

interface Options {
  isBuild?: boolean
}

export default function createScriptConfig(context: string, options: Options = {}) {
  return !options.isBuild
    ? createDevScriptConfig(context)
    : createBuildScriptConfig(context)
}