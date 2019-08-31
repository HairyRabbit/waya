import * as webpack from 'webpack'
// import * as path from 'path'
import { getOptions } from 'loader-utils'
import generateWrapper from './wrapper-generator'

export function pitch(this: webpack.loader.LoaderContext, remainingRequest: string) {
  this.cacheable && this.cacheable(true)
  const options = getOptions(this) || {}
  const { result } = generateWrapper(remainingRequest, options)
  // const { result, map } = generateWrapper(remainingRequest, options)
  // this.emitFile(path.basename(map.file), map.content, undefined)
  return result
}