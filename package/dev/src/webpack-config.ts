import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import * as normalizeData from 'normalize-package-data'
import * as path from 'path'
import createDefaultConfig from './default-config'
import createScriptConfig from './script-config'
import createStyleConfig from './style-config'
import createHtmlConfig from './html-config'
import createLogoConfig from './logo-config'
import createImageConfig from './image-config'
import { WebpackResolveFallbackPlugin, WebpackResolveFallbackPluginOptions } from 'waya-core'

export interface CreateWebpackOptions {
  readonly context: string
  readonly project: string
  readonly pkg: normalizeData.Package
  readonly entry: {
    style: (string | undefined)[]
    script: (string | undefined)[]
  }
  readonly fallbacks: { fileName: string, options?: Partial<WebpackResolveFallbackPluginOptions> }[]
  readonly style: {
    readonly globals: string
    readonly cssvar: string
  }
  readonly logo: string
  readonly library: {
    readonly context: string,
    readonly include: {
      style: string[]
      script: string[]
    }
  }
  readonly url: URL
}

export function createWebpackConfig({ 
  context, 
  project,
  library, 
  entry, 
  fallbacks,
  pkg, 
  style: { 
    globals, 
    cssvar 
  }, 
  logo,
  url
}: CreateWebpackOptions): webpack.Configuration {
  const defaultConfig = createDefaultConfig({ context, name: pkg.name, libraryContext: library.context })
  const scriptConfig = createScriptConfig({ context })
  const styleConfig = createStyleConfig({ context, globals, cssvar })
  const htmlConfig = createHtmlConfig({ name: pkg.name, ...library.include })
  const logoConfig = createLogoConfig({ context, logo })
  const imageConfig = createImageConfig({ })

  const prependEntries = [
    require.resolve('webpack-dev-server/client')+ '?' + url.toString(),
    require.resolve('webpack/hot/dev-server')
  ]

  const commons: webpack.Configuration = {
    entry: () => ([
      ...prependEntries,
      ...entry.style,
      ...entry.script
    ].filter((entry): entry is string => !!entry)),
    plugins: [
      ...fallbacks.map(({ fileName, options = {} }) => new WebpackResolveFallbackPlugin(
        path.resolve(context, fileName),
        path.resolve(project, fileName),
        { contextAlias: '@', ...options }
      ))
    ]
  }
  
  return webpackMerge(
    defaultConfig,
    scriptConfig,
    styleConfig,
    htmlConfig,
    logoConfig, 
    imageConfig, 
    commons
  )
}