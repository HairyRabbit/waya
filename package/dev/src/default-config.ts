import * as path from 'path'
import * as webpack from 'webpack'

const DEFAULT_EXTENSIONS: string[] = ['.js', '.json', '.mjs', '.ts', '.tsx']

interface Options {
  readonly context: string
  readonly name: string
  readonly libraryContext: string
}

export default function createDefaultConfig({ context, name, libraryContext }: Options): webpack.Configuration {
  return {
    mode: 'development',
    context,
    name: name + '-dev',
    devtool: 'inline-source-map',
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
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
}