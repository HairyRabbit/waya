import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { Service, ServiceCallback } from '../service'

const enum ErrorCode {
  ServerListenError = 40001,
  ServerAlreadyRun = 40002,
  ServerNotRun = 40003,
  StatusNotExists = 40004
}

export default class Webpack {
  compiler: webpack.Compiler | null = null
  server: WebpackDevServer | null = null
  stats: webpack.Stats.ToJsonOutput | null = null

  constructor(_service: Service) {}
  
  configure() {
    this.compiler = webpack({})
    this.server = new WebpackDevServer(this.compiler, {})
    return this
  }

  cleanup() {
    this.compiler = null
    this.server = null
    this.stats = null
    return this
  }

  startServer(_args: string[], callback: ServiceCallback): void {
    if(null !== this.server) return callback({
      code: ErrorCode.ServerAlreadyRun,
      message: 'server was running'
    })

    this.configure().server!.listen(8080, `0.0.0.0`, err => {
      if(err) return callback({
        code: ErrorCode.ServerListenError,
        message: err.message,
        data: err
      })
      callback(null)
    })
  }

  stopServer(_args: string, callback: ServiceCallback): void {
    if(null === this.server) return callback({
      code: ErrorCode.ServerNotRun,
      message: 'server not running'
    })

    this.server.close(() => {
      this.cleanup()
      callback(null)
    })
  }

  getStats(_args: string, callback: ServiceCallback<this['stats']>): void {
    if(null === this.stats) return callback({
      code: ErrorCode.StatusNotExists,
      message: 'status not exists'
    })

    callback(null, this.stats)
  }

  exports = {
    startServer: this.startServer.bind(this),
    stopServer: this.stopServer.bind(this)
  }
}