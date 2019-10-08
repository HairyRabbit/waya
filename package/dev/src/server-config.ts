import * as WebpackDevServer from 'webpack-dev-server'

export interface CreateServerOptions {
  readonly url: URL
}

export function createServerConfig({ url }: CreateServerOptions): WebpackDevServer.Configuration {
  return {
    port: parseInt(url.port),
    host: url.host,
    hot: true,
    historyApiFallback: {
      verbose: true
    }
  }
}