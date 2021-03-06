import * as path from 'path'
import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import * as normalizeData from 'normalize-package-data'
import { 
  WebpackResolveFallbackPlugin, 
  WebpackResolveFallbackPluginOptions 
} from 'waya-shared'
import createDefaultConfig from './default-config'
import createScriptConfig from './script-config'
import createStyleConfig from './style-config'
import createHtmlConfig from './html-config'
import createLogoConfig from './logo-config'
import createImageConfig from './image-config'
import createI18nConfig from './i18n-config'
import createIconConfig from './icon-config'


export interface CreateWebpackOptions {
  context: string
  project: string
  pkg: normalizeData.Package
  entry: {
    style: (string | undefined)[]
    script: (string | undefined)[]
  }
  fallbacks: { fileName: string, options?: Partial<WebpackResolveFallbackPluginOptions> }[]
  style: {
    globals: string
    cssvar: string
  }
  logo: string
  library: {
    context: string,
    include: {
      style: string[]
      script: string[]
    }
  }
  url: URL
  lang: string
  locales: string
  image: string
  icon: string
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
  url,
  lang,
  image,
  locales,
  icon
}: Readonly<CreateWebpackOptions>): webpack.Configuration {
  const defaultConfig = createDefaultConfig({ context, name: pkg.name, modulesContext: library.context })
  const scriptConfig = createScriptConfig({ context })
  const styleConfig = createStyleConfig({ context, globals, cssvar })
  const htmlConfig = createHtmlConfig({ name: pkg.name, ...library.include, lang })
  const logoConfig = createLogoConfig({ context, logo })
  const imageConfig = createImageConfig({ context: image })
  const i18nConfig = createI18nConfig({ context: locales })
  const iconConfig = createIconConfig({ context: icon })

  const prependEntries = [
    require.resolve('webpack-dev-server/client') + '?' + url.toString(),
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
    i18nConfig,
    iconConfig,
    commons
  )
}

export default createWebpackConfig