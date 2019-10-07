/**
 * webpack-contrib/url-loader
 * @see https://github.com/webpack-contrib/url-loader
 * @version 2.2.0
 */
declare module 'url-loader' {
  import { Options as FileLoaderOptions } from 'file-loader'

  export interface Options extends FileLoaderOptions{
    /**
     * Specifies an alternative loader to use when a target file's size exceeds the limit set in the `limit` option.
     * @default 'file-loader'
     */
    fallback?: string
    /**
     * The limit can be specified via loader options and defaults to no limit.
     */
    limit?: number | string | boolean
    /**
     * Sets the MIME type for the file to be transformed. If unspecified the file extensions will be used to lookup the MIME type.
     */
    mimetype?: string
  }
}