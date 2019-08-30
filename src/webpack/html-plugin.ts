import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import * as HTMLEWebpackTemplate from 'html-webpack-template'
import * as webpack from 'webpack'

export default function makeHtmlPlugin(): webpack.Plugin {
  return new HTMLWebpackPlugin({
    template: HTMLEWebpackTemplate,
    inject: false,
    mountId: 'app'
  })
}