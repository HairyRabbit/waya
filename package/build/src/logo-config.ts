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
    prefix: context,
    favicons: {
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        firefox: false,
        windows: false,
        yandex: false,
        favicons: true
      }
    }
  }

  return {
    plugins: [
      new FaviconsWebpackPlugin(options)
    ]
  }
}