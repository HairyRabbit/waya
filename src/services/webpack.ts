import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import { Service, ServiceCallback } from '../service'
// import createWebpackConfig from '../bundler/webpack-config'
// import createWebpackBuildConfig from '../bundler/webpack-build-config'
import { createWebpackConfig, createServerConfig, CreateWebpackOptions } from 'waya-dever'
import * as controlledFiles from '../bundler/controlled-files.json'
import * as fs from 'fs'
import lazyRequire from '../lazy-require'
import * as path from 'path'
import resolvePackage from '../bundler/package-resolver'
import contextResolve from '../context-resolve'
import { WebpackDevMiddleware } from 'webpack-dev-middleware'

const files: ReadonlyArray<string> = Object.values(controlledFiles).flat()
const RootLoader = require.resolve('../bundler/root-loader')

declare module 'webpack-dev-server' {
  // interface Configuration {
  //   injectClient: boolean
  // }

  interface WebpackDevServer {
    middleware: WebpackDevMiddleware
  }
}

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
    const url = new URL('https://localhost:8080')
    const pkg = resolvePackage(context)
    const project = contextResolve('project')
    const libraryContext = contextResolve('node_modules')
    const logo = contextResolve('logo.svg')
    const fallbacks: CreateWebpackOptions['fallbacks'] = [
      { fileName: 'boot.ts' },
      { fileName: 'index.ts' },
      { fileName: 'App.tsx' },
      { fileName: 'style.scss', options: { extensionsFree: false } },
      { fileName: 'style.json', options: { extensionsFree: false } }
    ]
    

    // const webpackOptions = createWebpackConfig(context)
    const webpackOptions = createWebpackConfig({ 
      context, 
      project, 
      url,
      pkg,
      fallbacks,
      entry: {
        style: [
          path.resolve(context, controlledFiles.style[0]),
          path.resolve(context, controlledFiles.cssvar[0])
        ],
        script: [
          [ RootLoader, path.resolve(context, 'boot.ts') ].join('!')
        ]
      },
      style: {
        globals: path.resolve(context, controlledFiles.style[0]),
        cssvar: path.resolve(context, controlledFiles.cssvar[0])
      },
      library: {
        context: libraryContext,
        include: {
          style: [],
          script: []
        }
      },
      logo
    })
    const serverOptions = createServerConfig({ url })
    this.compiler = webpack(webpackOptions)
    this.server = new WebpackDevServer(this.compiler, {
      ...serverOptions,
      proxy: {
        ...serverOptions.proxy,
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

  async build([ context = process.cwd() ]: [ string, ], callback: ServiceCallback<webpack.Stats.ToJsonOutput>) {
    const { createWebpackBuildConfig } = await lazyRequire('waya-builder')
    const pkg = resolvePackage(context)
    const project = contextResolve('project')
    const libraryContext = contextResolve('node_modules')
    const logo = contextResolve('logo.svg')
    const fallbacks: CreateWebpackOptions['fallbacks'] = [
      { fileName: 'boot.ts' },
      { fileName: 'index.ts' },
      { fileName: 'App.tsx' },
      { fileName: 'style.scss', options: { extensionsFree: false } },
      { fileName: 'style.json', options: { extensionsFree: false } }
    ]

    const options = createWebpackBuildConfig({
      context,
      project,
      pkg,
      fallbacks,
      // entries: [
      //   fallbackResolve(controlledFiles.style[0], context, project),
      //   fallbackResolve(controlledFiles.cssvar[0], context, project),
      //   [ 
      //     RootLoader, 
      //     fallbackResolve('boot.ts', context, project)
      //   ].join('!')
      // ],
      entries: [
        path.resolve(context, controlledFiles.style[0]),
        path.resolve(context, controlledFiles.cssvar[0]),
        [ RootLoader, path.resolve(context, 'boot.ts') ].join('!')
      ],
      style: {
        globals: path.resolve(context, controlledFiles.style[0]),
        cssvar: path.resolve(context, controlledFiles.cssvar[0])
      },
      library: {
        context: libraryContext,
        exclude: {},
        include: {
          style: [],
          script: []
        }
      },
      logo
    })
    webpack(options).run((err, stats) => {
      console.log(err, stats.toString({ colors: true }))
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