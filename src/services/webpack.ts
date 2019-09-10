import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { Service, ServiceCallback } from '../service'
import makeOptions, { makeBuildOptions } from '../webpack/options-maker'
import * as controlledFiles from '../webpack/controlled-files.json'
import * as fs from 'fs'

const files: ReadonlyArray<string> = Object.values(controlledFiles).flat()

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
  watcher: fs.FSWatcher | null = null

  constructor(_service: Service) {}
  
  configure(context: string) {
    const webpackOptions = makeOptions(context)
    this.compiler = webpack(webpackOptions.compiler)
    this.server = new WebpackDevServer(this.compiler, {
      ...webpackOptions.server,
      proxy: {
        ...webpackOptions.server.setup,
        '/__service__': 'http://localhost:1973'
      }
    })
    return this
  }

  cleanup() {
    this.compiler = null
    this.server = null
    this.stats = null
    this.watcher && this.watcher.close()
    this.watcher = null
    return this
  }

  start(args: { context: string }, callback: ServiceCallback): void {
    if(null !== this.server) return callback({
      code: ErrorCode.ServerAlreadyRun,
      message: 'server was running'
    })

    this.watcher = fs.watch(args.context || process.cwd(), { persistent: false, recursive: true }, (eventType, filename) => {
      if('change' === eventType) return
      console.log(this.constructor.name, eventType, filename)
      if(!filename) return
      if(!files.includes(filename.replace(/\\/, '\/'))) return
      (this.server as unknown as WebpackDevServer.WebpackDevServer).middleware.invalidate()
    })

    this.configure(args.context || process.cwd()).server!.listen(8080, err => {
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