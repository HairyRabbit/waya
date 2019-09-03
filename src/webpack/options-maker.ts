import * as webpack from 'webpack'
import * as WebpackDevServer from 'webpack-dev-server'
import * as express from 'express'
import resolveEntry from './entry-resolver'
import getLibraryOptions from './library'
import getScriptRules from './script-rules'
import getStyleRules from './style-rules'
import getHtmlPlugin from './html-plugin'
import resolvePackage from './package-resolver'
// import * as LoadablePlugin from '@loadable/webpack-plugin'
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

interface Options {
  ssr: boolean
}

const DEFAULT_OPTIONS: Options = {
  ssr: false
}

export default function makeOptions(context: string, options: Partial<Readonly<Options>> = {}): { compiler: webpack.Configuration, server: WebpackDevServer.Configuration } {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const url = new URL('http://localhost:8080')
  const pkg = resolvePackage(context)
  const libraryOptions = getLibraryOptions()
  const scriptRules = getScriptRules(context)
  const styleRules = getStyleRules([])
  const htmlPlugin = getHtmlPlugin({
    url
  })
  const entry = resolveEntry(context)

  const compilerOptions: webpack.Configuration = {
    mode: 'development',
    name: pkg.name + '-dev',
    devtool: 'inline-source-map',
    context,
    entry,
    output: {
      library: 'Application',
      libraryTarget: 'this',
      globalObject: 'globalThis'
    },
    node: {
      process: true
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
      ...htmlPlugin,
      // new LoadablePlugin()
    ]
  }

  const serverOptions: WebpackDevServer.Configuration = {
    port: parseInt(url.port),
    host: url.host,
    historyApiFallback: {
      verbose: true
    },
    injectClient: false,
    stats: 'minimal',

    before(app: express.Application, server) {
      if(opts.ssr) app.use((req, res, next) => {
        const url = req.url
        const re = /\.\w+$/
        if(re.test(url)) return next()
        const send = res.send
        res.send = (...args: any[]): any => {
          const bundle = server.middleware.fileSystem.readFileSync(path.resolve(context, 'dist', 'main.js'), 'utf-8')
          const code = new vm.Script(`\
globalThis.RouterProps = {
  location: ${JSON.stringify(url)},
  context: {}
};
${bundle};
// {pageFoo};
// {pageBar};
(async (require) => {
  const App = globalThis.Application.default
  const { renderToString } = require('react-dom/server')
  const { renderToStringAsync } = require('react-async-ssr')

  console.log(html)
  // console.log(require('util').inspect(App, { depth: null }))
  return await renderToStringAsync(App)
})
`)
          const promise: Promise<string> = code.runInThisContext()(require)
          promise.then(result => {
            console.log(result)
            const html = args[0].toString().replace(
              /<div id="app">(?:[^<]*)<\/div>/,
              `<div id="app">${result}</div>`
            )
            
            console.debug(url)
            console.debug(result)
            send.apply(res, [Buffer.from(html), ...args.slice(1)] as any)
          })
        }
        next()
      })
    }
  }
  
  return {
    compiler: compilerOptions,
    server: serverOptions
  }
}

export function makeBuildOptions(context: string): webpack.Configuration[] {
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
    scripts: libraryOptions.script,
    isProduction: true
  })
  
  const compilerOptions: webpack.Configuration = {
    mode: 'production',
    name: pkg.name,
    context,
    entry: { 
      main: entries,
      boot: require.resolve('./app-bootstrapper')
    },
    output: {
      filename: '[name].[hash].js',
      library: 'Application',
      libraryTarget: 'this',
      globalObject: 'globalThis'
    },
    resolve: {
      extensions: EXTENSIONS,
      alias: {
        'core-js': libraryOptions.alias['core-js']
      }
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
      ...htmlPlugin
    ]
  }

  return [
    compilerOptions,
    {
      ...compilerOptions,
      name: compilerOptions.name + '-server',
      target: 'node',
      output: {
        ...compilerOptions.output,
        libraryTarget: 'commonjs2',
        filename: '[name].server.js',
      },
      optimization: {
        ...compilerOptions.optimization,
        minimize: false
      }
    }
  ]
}