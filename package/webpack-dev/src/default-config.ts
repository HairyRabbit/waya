import * as webpack from 'webpack'

export const DEFAULT_EXTENSIONS: string[] = ['.js', '.mjs', '.json', '.ts', '.tsx']
const DEFAULT_NAME: string = 'app'
const DEFAULT_MODULES: string = 'node_modules'

export interface DefaultConfigOptions {
  context: string
  name?: string
  modulesContext?: string
}

export function createDefaultConfig({ 
  context, 
  name = DEFAULT_NAME, 
  modulesContext 
}: Readonly<DefaultConfigOptions>): webpack.Configuration {
  let common: webpack.Configuration = {
    mode: 'development',
    context,
    devtool: 'inline-source-map',
    output: {
      publicPath: '/'
    },
    resolve: { 
      extensions: DEFAULT_EXTENSIONS,
      alias: {
        '@': context
      }
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }

  if(name) {
    common.name = name + '-dev'
  }

  if(modulesContext) {
    common.resolve = common.resolve || {}
    common.resolve.modules = [
      DEFAULT_MODULES,
      modulesContext
    ]
  }

  return common
}

export default createDefaultConfig