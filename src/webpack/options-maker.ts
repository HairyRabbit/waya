import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import resolveEntry from './entry-resolver'
import getLibraryOptions from './library'
import getScriptRules from './script-rules'
import getStyleRules from './style-rules'
import getHtmlPlugin from './html-plugin'

const EXTENSIONS: string[] = ['.js', '.json', '.ts', '.tsx']

export default function makeOptions(context: string): { compiler: webpack.Configuration, server: WebpackDevServer.Configuration } {
  const libraryOptions = getLibraryOptions()
  const scriptRules = getScriptRules(context)
  const styleRules = getStyleRules([])
  const htmlPlugin = getHtmlPlugin()
  const entries = resolveEntry(context)

  const compiler: webpack.Configuration = {
    mode: 'development',
    name: 'app',
    context,
    entry: {
      main: entries
    },
    resolve: {
      extensions: EXTENSIONS,
      alias: {
        ...libraryOptions.alias
      }
    },
    module: {
      rules: [
        ...scriptRules,
        ...styleRules
      ]
    },
    plugins: [
      ...Object.values(libraryOptions.plugins),
      htmlPlugin
    ]
  }

  const server: WebpackDevServer.Configuration = {}
  
  return {
    compiler,
    server
  }
}