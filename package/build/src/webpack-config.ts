import * as path from 'path'
import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import * as normalizeData from 'normalize-package-data'
import createDefaultConfig from './default-config'
import createScriptConfig from './script-config'
import createStyleConfig from './style-config'
import createHtmlConfig from './html-config'
// import createLogoConfig from './logo-config'
import createImageConfig from './image-config'
import { WebpackResolveFallbackPluginOptions, WebpackResolveFallbackPlugin } from 'waya-core'

export interface createWebpackBuildConfigOptions {
  readonly context: string
  readonly project: string
  readonly pkg: normalizeData.Package
  readonly entries: string | string[]
  readonly style: {
    readonly globals: string
    readonly cssvar: string
  }
  readonly logo: string
  readonly library: {
    readonly context: string,
    readonly exclude: { 
      readonly [key: string]: string 
    }
    readonly include: {
      style: string[]
      script: string[]
    }
  }
  readonly fallbacks: {
    fileName: string
    options?: Partial<WebpackResolveFallbackPluginOptions>
  }[]
}

export function createWebpackBuildConfig({ 
  context, 
  project,
  library, 
  entries, 
  fallbacks,
  pkg, 
  style: { 
    globals, 
    cssvar 
  }, 
  // logo 
}: createWebpackBuildConfigOptions): webpack.Configuration[] {
  const defaultConfigs = createDefaultConfig({ context, name: pkg.name, libraryContext: library.context })
  const scriptConfig = createScriptConfig({ context })
  const styleConfig = createStyleConfig({ context, globals, cssvar })
  const htmlConfig = createHtmlConfig({ name: pkg.name, ...library.include })
  // const logoConfig = createLogoConfig({ context, logo })
  const imageConfig = createImageConfig({ })

  const commons: webpack.Configuration = {
    entry: { main: entries },
    output: {
      library: 'Application',
      libraryTarget: 'this',
      globalObject: 'globalThis'
    },
    externals: library.exclude,
    plugins: [
      ...fallbacks.map(({ fileName, options = {} }) => new WebpackResolveFallbackPlugin(
        path.resolve(context, fileName), 
        path.resolve(project, fileName), 
        { contextAlias: '@', ...options })
      )
    ]
  }
  
  return defaultConfigs.map(defaultConfig => {
    return webpackMerge(
      defaultConfig,
      scriptConfig,
      styleConfig,
      htmlConfig,
      // logoConfig, 
      imageConfig, 
      commons
    )
  })
}