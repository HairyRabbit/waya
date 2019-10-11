import * as WebpackDevServer from 'webpack-dev-server'
import * as createDebugger from 'debug'

const historyDebug = createDebugger('history-fallback')

export interface CreateServerOptions {
  readonly url: URL
  readonly contents?: string[]
}

export function createServerConfig({ url, contents }: CreateServerOptions): WebpackDevServer.Configuration {
  return {
    port: parseInt(url.port),
    host: url.hostname,
    https: url.protocol.startsWith('https'),
    hot: true,
    historyApiFallback: {
      logger: historyDebug
    },
    publicPath: '/',
    contentBase: contents
  }
}