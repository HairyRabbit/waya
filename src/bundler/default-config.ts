import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import * as path from 'path'

interface Options {
  readonly context: string
  readonly name: string
}

const EXTENSIONS: string[] = ['.js', '.json', '.mjs', '.ts', '.tsx']

function createCommonDefaultConfig(context: string): webpack.Configuration {
  return {
    context,
    resolve: { extensions: EXTENSIONS }
  }
}

export function createDevDefaultConfig({ context, name }: Options): webpack.Configuration {
  return {
    ...createCommonDefaultConfig(context),
    mode: 'development',
    devtool: 'inline-source-map',
    name: name + '-dev',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
}

export function createBuildDefaultConfig({ context, name }: Options): webpack.Configuration[] {
  const common = createCommonDefaultConfig(context)
  const buildCommon: webpack.Configuration = {
    mode: 'production',
    output: {
      filename: '[name].[hash].js'
    },
    plugins: [
      new CleanWebpackPlugin()
    ]
  }

  const configs: webpack.Configuration[] = [{
    name,
    devtool: 'hidden-source-map',
    output: {
      path: path.join(context, 'dist', 'Release')
    }
  }, {
    name: name + '-debug',
    devtool: 'source-map',
    output: {
      path: path.join(context, 'dist', 'Debug')
    }
  }]

  return configs.map(config => webpackMerge(common, buildCommon, config))
}