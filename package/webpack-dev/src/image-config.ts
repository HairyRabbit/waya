import * as webpack from 'webpack'
import { createLoaderUse, Loader } from 'waya-shared'

export const DEFAULT_IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg']

export interface ImageConfigOptions {
  context: string
}

export function createImageLoaderUse(): webpack.RuleSetUse {
  return [
    createLoaderUse(Loader.Url)
  ]
}

export function createImageConfig({ context }: Readonly<ImageConfigOptions>): webpack.Configuration {
  const regexp = new RegExp(`(${DEFAULT_IMAGE_EXTENSIONS.join('|')})$`)
  return {
    module: {
      rules: [{
        test: regexp,
        include: context,
        use: createImageLoaderUse()
      }]
    }
  }
}

export default createImageConfig