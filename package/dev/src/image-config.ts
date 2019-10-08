import * as webpack from 'webpack'
import { createLoaderUse, Loader } from 'waya-core'

interface Options {
}

export default function createImageConfig({  }: Options): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.(jpe?g|png|gif|svg|webp)$/,
        use: [
          createLoaderUse(Loader.Url)
        ]
      }]
    }
  }
}