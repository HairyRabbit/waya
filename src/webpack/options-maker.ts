import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import * as express from 'express'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import resolveEntry from './entry-resolver'
import getLibraryOptions from './library'
import getScriptRules from './script-rules'
import getStyleRules from './style-rules'
import getHtmlPlugin from './html-plugin'
import resolvePackage from './package-resolver'
import * as path from 'path'
import * as vm from 'vm'

const EXTENSIONS: string[] = ['.js', '.json', '.ts', '.tsx']

declare module 'webpack-dev-server' {
  interface Configuration {
    injectClient: boolean
  }

  interface WebpackDevServer {
    middleware: any
  }
}

export default function makeOptions(context: string): { compiler: webpack.Configuration, server: WebpackDevServer.Configuration } {
  const libraryOptions = getLibraryOptions()
  const scriptRules = getScriptRules(context)
  const styleRules = getStyleRules([])
  const htmlPlugin = getHtmlPlugin()
  const entries = resolveEntry(context)

  const compiler: webpack.Configuration = {
    mode: 'development',
    name: 'app-dev',
    context,
    entry: {
      main: entries,
      boot: require.resolve('./app-bootstrapper')
    },
    output: {
      library: 'Application',
      libraryTarget: 'this',
      globalObject: 'globalThis'
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
      ...htmlPlugin
    ]
  }

  const server: WebpackDevServer.Configuration = {
    historyApiFallback: {
      verbose: true,
      // rewrites: [{
      //   from: /.*/,
      //   to(context) {
      //     const RuntimeCacheContent = JSON.parse(fs.readFileSync(RuntimeCache, 'utf-8'))
      //     fs.writeFileSync(RuntimeCache, JSON.stringify({ ...RuntimeCacheContent, href: context.parsedUrl.href }))
      //     return '/index.html?__SSR__=' + context.parsedUrl.href
      //   }
      // }]
    },
    injectClient: false,

    before(app: express.Application, server) {
      app.use((req, res, next) => {
        const url = req.url
        const re = /\.\w+$/
        if(re.test(url)) return next()
        const send = res.send
        res.send = (...args: any[]) => {
          const bundle = server.middleware.fileSystem.readFileSync(path.resolve(context, 'dist', 'main.js'), 'utf-8')
          const code = new vm.Script(`${bundle};((require) => require('react-dom/server').renderToString(globalThis.Application.default))`)
          const result = code.runInThisContext()(require)
          const html = args[0].toString().replace(
            /<div id="app">(?:[^<]*)<\/div>/,
            `<div id="app">${result}</div>`
          )
          
          console.debug(url)
          console.debug(result)
          return send.apply(res, [Buffer.from(html), ...args.slice(1)] as any)
        }
        next()
      })
    }
  }
  
  return {
    compiler,
    server
  }
}

export function makeBuildOptions(context: string): webpack.Configuration {
  const pkg = resolvePackage(context)
  const entries = resolveEntry(context, {
    isProduction: true
  })
  const libraryOptions = getLibraryOptions()
  const scriptRules = getScriptRules(context, true)
  const styleRules = getStyleRules([])
  const htmlPlugin = getHtmlPlugin({ 
    name: pkg.name, 
    description: pkg.description,
    links: libraryOptions.style,
    scripts: libraryOptions.script
  })
  
  return {
    mode: 'production',
    name: pkg.name,
    context,
    entry: { main: entries },
    output: {
      filename: '[name].[chunkhash].js',
      // library: 'APP',
      libraryTarget: 'this',
      globalObject: 'globalThis'
    },
    resolve: {
      extensions: EXTENSIONS
    },
    externals: {
      ...libraryOptions.externals
    },
    module: {
      rules: [
        ...scriptRules,
        ...styleRules
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      ...htmlPlugin
    ]
  }
}