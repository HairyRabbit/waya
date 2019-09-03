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
}

const DEFAULT_TITLE: string = 'App'

export default function makeHtmlPlugin(options: Partial<Readonly<Options>> = {}): webpack.Plugin[] {
  const metas = []
  if(options.description) metas.push({ content: options.description, name: 'description' })

  return [ 
    new HTMLWebpackPlugin({
      template: HTMLEWebpackTemplate,
      inject: false,
      appMountId: 'app',
      mobile: true,
      title: options.name || DEFAULT_TITLE,
      meta: metas,
      scripts: options.scripts || [],
      links: options.links || [],
      lang: undefined,
      window: undefined,
      devServer: options.isProduction ? undefined : 'http://localhost:8080'
    } as HTMLEWebpackTemplate.Options)
  ]
}