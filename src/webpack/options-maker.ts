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
import * as LoadablePlugin from '@loadable/webpack-plugin'
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
    devtool: 'inline-source-map',
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
      new LoadablePlugin()
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
        res.send = (...args: any[]): any => {
          const bundle = server.middleware.fileSystem.readFileSync(path.resolve(context, 'dist', 'main.js'), 'utf-8')
          // const pageFoo = server.middleware.fileSystem.readFileSync(path.resolve(context, 'dist', 'foo.js'), 'utf-8')
          // const pageBar = server.middleware.fileSystem.readFileSync(path.resolve(context, 'dist', 'bar.js'), 'utf-8')
          // const { ChunkExtractor } = require('@loadable/server')
          // var extractor = new ChunkExtractor({ stats})
          const statsFile = server.middleware.fileSystem.readFileSync(path.resolve(context, 'dist', 'loadable-stats.json'), 'utf-8')
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
  const { ChunkExtractor } = require('@loadable/server')
  const extractor = new ChunkExtractor({ stats: ${statsFile} })
  const jsx = extractor.collectChunks(App)
  const html = await renderToStringAsync(jsx)
  const scriptTags = extractor.getScriptTags()
  const linkTags = extractor.getLinkTags()
  const styleTags = extractor.getStyleTags()

  console.log(html)
  // console.log(require('util').inspect(globalThis.Application.default, { depth: null }))
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
    scripts: libraryOptions.script,
    isProduction: true
  })
  
  return {
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
      new CleanWebpackPlugin(),
      ...htmlPlugin
    ]
  }
}