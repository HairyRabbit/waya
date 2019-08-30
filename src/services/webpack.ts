import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { Service, ServiceCallback } from '../service'
import getLibraryOptions from '../webpack/library'
import getScriptRules from '../webpack/script-rules'
import getStyleRules from '../webpack/style-rules'
import getHtmlPlugin from '../webpack/html-plugin'

export const enum ErrorCode {
  ServerListenError = 40001,
  ServerAlreadyRun = 40002,
  ServerNotRun = 40003,
  StatusNotExists = 40004
}

const EXTENSIONS: string[] = ['.js', '.json', '.ts', '.tsx']

export default class Webpack {
  compiler: webpack.Compiler | null = null
  server: WebpackDevServer | null = null
  stats: webpack.Stats.ToJsonOutput | null = null

  constructor(_service: Service) {}
  
  configure(context: string) {
    const options = this.makeOptions(context)
    this.compiler = webpack(options.compiler)
    this.server = new WebpackDevServer(this.compiler, options.server)
    return this
  }

  makeOptions(context: string): { compiler: webpack.Configuration, server: WebpackDevServer.Configuration } {
    const libraryOptions = getLibraryOptions()
    const scriptRules = getScriptRules(context)
    const styleRules = getStyleRules([])
    const htmlPlugin = getHtmlPlugin()

    const compiler: webpack.Configuration = {
      mode: 'development',
      name: 'app',
      context,
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

  cleanup() {
    this.compiler = null
    this.server = null
    this.stats = null
    return this
  }

  start(args: { context: string }, callback: ServiceCallback): void {
    if(null !== this.server) return callback({
      code: ErrorCode.ServerAlreadyRun,
      message: 'server was running'
    })

    this.configure(args.context || process.cwd()).server!.listen(8080, `0.0.0.0`, err => {
      if(err) return callback({
        code: ErrorCode.ServerListenError,
        message: err.message,
        data: err
      })
      callback(null)
    })
  }

  stop(_args: string, callback: ServiceCallback): void {
    if(null === this.server) return callback({
      code: ErrorCode.ServerNotRun,
      message: 'server not running'
    })

    this.server.close(() => {
      this.cleanup()
      callback(null)
    })
  }

  status(_args: string, callback: ServiceCallback<this['stats']>): void {
    if(null === this.stats) return callback({
      code: ErrorCode.StatusNotExists,
      message: 'status not exists'
    })

    callback(null, this.stats)
  }

  makeBuildOptions(): webpack.Configuration {
    return {
      mode: 'production'
    }
  }

  build() {

  }

  exports = {
    start: this.start.bind(this),
    stop: this.stop.bind(this)
  }
}