/**
 * webpack-contrib/file-loader
 * @see https://github.com/webpack-contrib/file-loader
 * @version 4.2.0
 */
declare module 'file-loader' {
  export interface Options {
    /**
     * Specifies a custom filename template for the target file(s) using the query parameter name. For example, to emit a file from your context directory into the output directory retaining the full directory structure, you might use:
     * @default '[contenthash].[ext]'
     */
    name?: string | ((file: string) => string)
    /**
     * Specify a filesystem path where the target file(s) will be placed.
     */
    outputPath?: string | ((url: string, resourcePath: string, context: string) => string)
    /**
     * Specifies a custom public path for the target file(s).
     * @default __webpack_public_path__
     */
    publicPath?: string | ((url: string, resourcePath: string, context: string) => string)
    /**
     * Specifies a custom function to post-process the generated public path. This can be used to prepend or append dynamic global variables that are only available at runtime, like `__webpack_public_path__`. This would not be possible with just publicPath, since it stringifies the values.
     */
    postTransformPublicPath?(p: string): string
    /**
     * Specifies a custom file context.
     * @default webpack.compiler.context
     */
    context?: string
    /**
     * If true, emits a file (writes a file to the filesystem). If false, the loader will return a public URI but will not emit the file. It is often useful to disable this option for server-side packages.
     * @default true
     */
    emitFile?: boolean
    /**
     * Specifies a Regular Expression to one or many parts of the target file path. The capture groups can be reused in the name property using [N] placeholder.
     */
    regExp?: RegExp
  }
}