import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { WebpackDevMiddleware } from 'webpack-dev-middleware'
import { Service, ServiceCallback } from '../service'
import makeOptions, { makeBuildOptions } from '../webpack/options-maker'
import { ScriptMatches, StyleMatches, StoreScriptMatches } from '../webpack/entry-resolver'
// import * as chokidar from 'chokidar'
import * as fs from 'fs'
import * as path from 'path'

declare module 'webpack-dev-server' {
  interface Configuration {
    injectClient: boolean
  }

  interface WebpackDevServer {
    middleware: WebpackDevMiddleware
  }
}

const controlled: string[] = [
  ...ScriptMatches, 
  ...StyleMatches, 
  ...StoreScriptMatches
]

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
    this.server = new WebpackDevServer(this.compiler, webpackOptions.server)
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

    // chokidar.watch('./store.ts')

    this.configure(args.context || process.cwd()).server!.listen(8080, err => {
      this.watcher = fs.watch(path.resolve(process.cwd()), { recursive: true }, (eventType, filename) => {
        if('change' === eventType) return
        if(!filename) return
        if(!controlled.includes(filename.replace(/\\/, '\/'))) return
        (this.server as unknown as WebpackDevServer.WebpackDevServer).middleware.invalidate()
      })

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