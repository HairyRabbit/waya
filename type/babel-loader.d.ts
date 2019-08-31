import { TransformOptions } from '@babel/core'

declare module "babel-loader" {
  export interface Options extends TransformOptions {
    cacheDirectory: boolean | string
    cacheIdentifier: string
    cacheCompression: boolean
    customize: null | Function
  }
}