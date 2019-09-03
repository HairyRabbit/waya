import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'
import generateWrapper from './wrapper-generator'

export function pitch(this: webpack.loader.LoaderContext, remainingRequest: string) {
  this.cacheable && this.cacheable(true)
  const options = getOptions(this) || {}
  const tsLoader = this.loaders[1]
  const { result } = generateWrapper(remainingRequest, {
    ...options,
    store: options.store ? tsLoader.request + '!' + options.store : undefined
  })
  return result
}