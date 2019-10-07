import * as path from 'path'
import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'

const DEFAULT_EXTENSIONS: string[] = ['.js', '.json', '.mjs', '.ts', '.tsx']
const DEFAULT_BUILDDIR: string = 'dist'
const DEFAULT_RELEASEDIR: string = 'Release'
const DEFAULT_DEBUGDIR: string = 'debug'

interface Options {
  readonly context: string
  readonly name: string
  readonly libraryContext: string
  readonly buildDir?: string
  readonly releaseDir?: string
  readonly debugDir?: string
}

function createCommonDefaultConfig(context: string, libraryContext: string): webpack.Configuration {
  return {
    mode: 'production',
    context,
    resolve: { 
      extensions: DEFAULT_EXTENSIONS,
      alias: {
        '@': context
      },
      modules: [
        path.resolve(context, 'node_modules'),
        libraryContext
      ]
    },
    output: {
      filename: '[name].[hash].js'
    },
    plugins: [
      new CleanWebpackPlugin()
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            enforce: true,
          },
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'all',
            priority: 1000,
            enforce: true
          },
        }
      }
    }
  }
}

export default function createDefaultConfig({ 
  context, 
  name, 
  libraryContext,
  buildDir = DEFAULT_BUILDDIR, 
  releaseDir = DEFAULT_RELEASEDIR, 
  debugDir = DEFAULT_DEBUGDIR
}: Options) {
  const common = createCommonDefaultConfig(context, libraryContext)

  const configs: webpack.Configuration[] = [{
    name,
    devtool: 'hidden-source-map',
    output: {
      path: path.join(context, buildDir, releaseDir)
    }
  }, {
    name: name + '-debug',
    devtool: 'source-map',
    output: {
      path: path.join(context, buildDir, debugDir)
    }
  }]

  return configs.map(config => webpackMerge(common, config))
}