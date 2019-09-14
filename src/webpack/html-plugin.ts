import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import * as HTMLEWebpackTemplate from 'html-webpack-template'
// import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import * as webpack from 'webpack'
// import * as path from 'path'

interface Options {
  name: string,
  description: string
  metas: HTMLEWebpackTemplate.Options['meta']
  links: HTMLEWebpackTemplate.Options['links']
  scripts: HTMLEWebpackTemplate.Options['scripts'],
  isProduction: boolean
  url: URL
  context: string
  logo: string
}

const DEFAULT_TITLE: string = 'App'
// const DEFUALT_FAVICON: string = path.resolve(__dirname, '../logo.svg')

export default function makeHtmlPlugin(options: Partial<Readonly<Options>> = {}): webpack.Plugin[] {
  const metas = []
  if(options.description) metas.push({ content: options.description, name: 'description' })
  return [ 
    new HTMLWebpackPlugin({
      template: HTMLEWebpackTemplate,
      inject: false,
      mobile: true,
      title: options.name || DEFAULT_TITLE,
      meta: metas,
      scripts: options.scripts || [],
      links: options.links || [],
      lang: undefined,
      window: undefined,
      bodyHtmlSnippet: '<div id="app">__SSR_PLACEHOLDER__</div>',
      // devServer: options.isProduction ? undefined : options.url ? options.url.origin : undefined
    } as HTMLEWebpackTemplate.Options),

    // new FaviconsWebpackPlugin({
    //   logo: options.logo || DEFUALT_FAVICON,
    //   inject: 'force',
    //   cache: false
    // })
  ]
}