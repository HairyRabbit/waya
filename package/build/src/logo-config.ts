import * as webpack from 'webpack'
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin'

interface Options {
  readonly context: string
  readonly logo: string
}

export default function createLogoConfig({ context, logo }: Options): webpack.Configuration {
  const options: FaviconsWebpackPlugin.Options = {
    logo,
    inject: true,
    cache: false,
    prefix: context
  }

  return {
    plugins: [
      new FaviconsWebpackPlugin(options)
    ]
  }
}