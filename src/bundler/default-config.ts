import * as webpack from 'webpack'

interface Options {
  readonly isBuild?: boolean
}

const EXTENSIONS: string[] = ['.js', '.json', '.mjs', '.ts', '.tsx']

function createCommonDefaultConfig(context: string): webpack.Configuration {
  return {
    context,
    resolve: { extensions: EXTENSIONS }
  }
}

function createDevDefaultConfig(context: string): webpack.Configuration {
  return {
    ...createCommonDefaultConfig(context),
    mode: 'development',
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
}

function createBuildDefaultConfig(context: string): webpack.Configuration {
  return {
    ...createCommonDefaultConfig(context),
    mode: 'production',
  }
}

export default function createDefaultConfig(context: string, options: Options = {}) {
  return !options.isBuild
    ? createDevDefaultConfig(context)
    : createBuildDefaultConfig(context)
}