import * as WebpackDevServer from 'webpack-dev-server'
import * as createDebugger from 'debug'

const historyDebug = createDebugger('history-fallback')

export interface CreateServerOptions {
  url: URL
  contents?: string[]
  proxy?: {
    [name: string]: string
  }
}

export function createServerConfig({ 
  url, 
  contents, 
  proxy = {} 
}: Readonly<CreateServerOptions>): WebpackDevServer.Configuration {
  return {
    port: parseInt(url.port),
    host: url.hostname,
    https: url.protocol.startsWith('https'),
    hot: true,
    historyApiFallback: {
      logger: historyDebug
    },
    publicPath: '/',
    contentBase: contents,
    proxy
  }
}