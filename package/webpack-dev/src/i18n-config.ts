import * as webpack from 'webpack'
import { createLoaderUse, Loader } from 'waya-shared'

export interface I18nConfigOptions {
  context: string
}

export function createI18nConfig({ 
  context
}: Readonly<I18nConfigOptions>): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.ya?ml$/,
        type: 'json',
        include: context,
        use: [
          createLoaderUse(Loader.Yaml)
        ]
      }]
    }
  }
}

export default createI18nConfig