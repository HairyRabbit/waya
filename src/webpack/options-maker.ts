import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import * as WebpackDevServer from 'webpack-dev-server'
import * as express from 'express'
import resolveEntry from './entry-resolver'
import getLibraryOptions from './library'
import getScriptRules from './script-rules'
import getStyleRules from './style-rules'
import getHtmlPlugin from './html-plugin'
import resolvePackage from './package-resolver'
// import * as LoadablePlugin from '@loadable/webpack-plugin'
import { WebpackDevMiddleware } from 'webpack-dev-middleware'
import * as path from 'path'
import * as vm from 'vm'
import ResolveFallbackPlugin from './resolve-fallback-plugin'
import createLogoConfig from './logo-config'

const EXTENSIONS: string[] = ['.js', '.json', '.mjs', '.ts', '.tsx']

declare module 'webpack-dev-server' {
  interface Configuration {
    injectClient: boolean
  }

  interface WebpackDevServer {
    middleware: WebpackDevMiddleware
  }
}

interface Options {
  ssr: boolean
}

const DEFAULT_OPTIONS: Options = {
  ssr: false
}

const PROJECT_CONTEXT: string = path.resolve(__dirname, '../project')

export default function makeOptions(context: string, options: Partial<Readonly<Options>> = {}): { compiler: webpack.Configuration, server: WebpackDevServer.Configuration } {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const url = new URL('http://localhost:8080')
  const pkg = resolvePackage(context)
  const libraryOptions = getLibraryOptions()
  const scriptRules = getScriptRules(context)
  const styleRules = getStyleRules(context)
  const htmlPlugin = getHtmlPlugin({
    url,
    context
  })
  const logoConfig = createLogoConfig(context)

  const entry = () => resolveEntry(context, { prepends: [ 
    require.resolve('webpack-dev-server/client')+ '?http://localhost:8080',
    require.resolve('webpack/hot/dev-server'),
    // require.resolve('react-hot-loader/patch'),
    logoConfig.entry as string
  ]})
  // delete logoConfig.entry
  // console.log(entry())

  const compilerOptions: webpack.Configuration = webpackMerge.smartStrategy({
    // 'entry.main': 'prepend'
  })(logoConfig, {
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
        ...libraryOptions.alias,
        '@': context
      }
    },
    module: {
      rules: [
        ...scriptRules,
        ...styleRules,
        {
          test: /logo\.svg$/,
          use: [{
            loader: require.resolve('@svgr/webpack'),
            options: {}
          }]
        }
      ]
    },
    plugins: [
      ...Object.values(libraryOptions.plugins),
      ...htmlPlugin,

      new webpack.HotModuleReplacementPlugin(),

      new ResolveFallbackPlugin(
        path.resolve(context, 'boot.ts'),
        path.resolve(PROJECT_CONTEXT, 'boot.ts')
      ),

      new ResolveFallbackPlugin(
        path.resolve(context, 'index.ts'),
        path.resolve(PROJECT_CONTEXT, 'index.ts')
      ),

      new ResolveFallbackPlugin(
        path.resolve(context, 'index.tsx'),
        path.resolve(PROJECT_CONTEXT, 'index.ts')
      ),
      
      new ResolveFallbackPlugin(
        path.resolve(context, 'App.tsx'),
        path.resolve(PROJECT_CONTEXT, 'App.tsx')
      ),

      // new LoadablePlugin()
    ]
  })

  const serverOptions: WebpackDevServer.Configuration = {
    port: parseInt(url.port),
    host: url.host,
    hot: true,
    historyApiFallback: {
      verbose: true
    },
    injectClient: false,
    // stats: 'minimal',

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
  const styleRules = getStyleRules(context)
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