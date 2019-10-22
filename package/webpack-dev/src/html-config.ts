import * as webpack from 'webpack'
import { HTMLWebpackPlugin, HTMLWebpackTemplate } from 'waya-shared'

const DEFAULT_TITLE: string = 'Application'

interface Options {
  readonly name: string
  readonly description?: string
  readonly metas?: { content: string, name: string }[]
  readonly lang?: string
  readonly window?: string
  readonly styles?: string[]
  readonly scripts?: string[]
}

export default function createHtmlConfig({ 
  name: title = DEFAULT_TITLE,
  description,
  metas = [],
  lang,
  window,
  scripts,
  styles: links
}: Options): webpack.Configuration {
  const meta = metas.slice()
  if(description) meta.unshift({ content: description, name: 'description' })

  const options: HTMLWebpackTemplate.Options = {
    template: HTMLWebpackTemplate,
    inject: false,
    mobile: true,
    title,
    // meta,
    scripts,
    links,
    lang,
    window,
    bodyHtmlSnippet: '<div id="app">__SSR_PLACEHOLDER__</div>',
  }
  return {
    plugins: [
      new HTMLWebpackPlugin(options)
    ]
  }
}