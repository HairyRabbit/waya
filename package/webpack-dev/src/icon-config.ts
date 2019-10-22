import * as webpack from 'webpack'
import { createLoaderUse, Loader } from 'waya-shared'

export interface IconConfigOptions {
  context: string
}

export function createIconConfig({
  context
}: Readonly<IconConfigOptions>): webpack.Configuration {
  return {
    module: {
      rules: [{
        test: /\.svg$/,
        include: context,
        use: createLoaderUse(Loader.SVG)
      }]
    }
  }
}

export default createIconConfig