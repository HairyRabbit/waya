import * as webpack from 'webpack'
import * as webpackMerge from 'webpack-merge'
import * as path from 'path'
import resolvePackage from './package-resolver'
import resolveEntry from './entry-resolver'
import getLibraryOptions from './library'
import { createBuildDefaultConfig } from './default-config'
import { createBuildScriptConfig } from './script-config'
import { createBuildStyleConfig } from './style-config'
import createLogoConfig from './logo-config'
import createImageConfig from './image-config'
import getHtmlPlugin from './html-plugin'
import ResolveFallbackPlugin from './resolve-fallback-plugin'

const PROJECT_CONTEXT: string = path.resolve(__dirname, '../project')

export default function createWebpackBuildConfig(context: string): webpack.Configuration[] {
  const pkg = resolvePackage(context)
  const entries = resolveEntry(context, {
    isProduction: true
  })
  const libraryOptions = getLibraryOptions()
  const defaultConfigs = createBuildDefaultConfig({ context, name: pkg.name })
  const scriptConfig = createBuildScriptConfig(context)
  const styleConfig = createBuildStyleConfig(context)
  const htmlPlugin = getHtmlPlugin({ 
    name: pkg.name, 
    description: pkg.description,
    links: libraryOptions.style,
    scripts: libraryOptions.script,
    isProduction: true
  })

  const logoConfig = createLogoConfig(context)
  const imageConfig = createImageConfig({
    isProduction: true
  })
  
  const compilerOptions = defaultConfigs.map(defaultConfig => {
    return webpackMerge.smartStrategy({
      // 'entry.main': 'prepend'
  })(
    defaultConfig,
    scriptConfig,
    styleConfig,
    logoConfig, 
    imageConfig, {
    entry: { 
      main: entries,
      // boot: require.resolve('./app-bootstrapper')
    },
    output: {
      library: 'Application',
      libraryTarget: 'this',
      globalObject: 'globalThis'
    },
    resolve: {
      alias: {
        ...libraryOptions.alias,
        // 'core-js': libraryOptions.alias['core-js']
      }
    },
    externals: {
      ...libraryOptions.externals
    },
    plugins: [
      ...htmlPlugin,
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
      )
    ]
    })
  })

  console.log(compilerOptions)

  return compilerOptions
}