import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import * as HTMLEWebpackTemplate from 'html-webpack-template'
import * as webpack from 'webpack'

interface Options {
  name: string,
  description: string
  metas: HTMLEWebpackTemplate.Options['meta']
  links: HTMLEWebpackTemplate.Options['links']
  scripts: HTMLEWebpackTemplate.Options['scripts'],
  isProduction: boolean
  url: URL
}

const DEFAULT_TITLE: string = 'App'

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
      devServer: options.isProduction ? undefined : options.url ? options.url.origin : undefined
    } as HTMLEWebpackTemplate.Options)
  ]
}