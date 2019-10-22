import * as webpack from 'webpack'
import { createLoaderUse, Loader } from 'waya-shared'

interface Options {
  readonly context: string
  readonly logo: string
}

export default function createLogoConfig({ logo }: Options): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: logo,
        use: createLoaderUse(Loader.Url)
      }]
    }
  }
}