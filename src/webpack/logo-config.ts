import * as webpack from 'webpack'
import * as path from 'path'
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin'

export const DEFAULT_ICON = path.resolve(__dirname, '../favicon.ico')

export interface LogoConfigOptions {
  logo: string
}

export default function createLogoConfig(options: Partial<Readonly<LogoConfigOptions>> = {}): webpack.Configuration {
  const logo = options.logo || DEFAULT_ICON
  return {
    plugins: [
      new FaviconsWebpackPlugin({
        logo,
        inject: 'force',
        cache: false,
        prefix: 'static/logo'
      })
    ]
  }
}