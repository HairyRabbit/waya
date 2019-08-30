import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { Service, ServiceCallback } from '../service'
import makeOptions, { makeBuildOptions } from '../webpack/options-maker'

export const enum ErrorCode {
  ServerListenError = 40001,
  ServerAlreadyRun = 40002,
  ServerNotRun = 40003,
  StatusNotExists = 40004,
  BuildError = 40005
}


export default class Webpack {
  compiler: webpack.Compiler | null = null
  server: WebpackDevServer | null = null
  stats: webpack.Stats.ToJsonOutput | null = null

  constructor(_service: Service) {}
  
  configure(context: string) {
    const options = makeOptions(context)
    this.compiler = webpack(options.compiler)
    this.server = new WebpackDevServer(this.compiler, options.server)
    return this
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

  build(args: { context: string }, callback: ServiceCallback<webpack.Stats.ToJsonOutput>) {
    const options = makeBuildOptions(args.context || process.cwd())
    webpack(options).run((err, stats) => {
      console.log(err, stats.toString({}))
      if(err) return callback({
        code: ErrorCode.BuildError,
        message: 'webpack build error',
        data: err
      })

      callback(null, stats.toJson({}))
    })
  }

  exports = {
    start: this.start.bind(this),
    stop: this.stop.bind(this),
    build: this.build.bind(this)
  }
}