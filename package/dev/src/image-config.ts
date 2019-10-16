import * as webpack from 'webpack'
import { createLoaderUse, Loader } from 'waya-core'

interface Options {
  context: string
}

export const DEFAULT_IMAGE_EXTENSIONS = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg']

export function createImageLoaderUse(): webpack.RuleSetUse {
  return [
    createLoaderUse(Loader.Url)
  ]
}

export default function createImageConfig({ context }: Options): webpack.Configuration {
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