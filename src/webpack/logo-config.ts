import * as webpack from 'webpack'
import * as path from 'path'
import * as FaviconsWebpackPlugin from 'favicons-webpack-plugin'
import * as files from './controlled-files.json'
import filesResolve from './files-resolver'

const UrlLoader = require.resolve('url-loader')
const LogoLoader = require.resolve('./logo-loader')

export const DEFAULT_LOGO = path.resolve(__dirname, '../icon.svg')

export interface LogoConfigOptions {
  readonly context: string
  readonly entry: string
}

const DEFAULT_LOGOCONFIGOPTIONS: LogoConfigOptions = {
  context: 'static/logo',
  entry: DEFAULT_LOGO
}

const enum LogoType { Normal, Ico }

export function resolveLogoEntrypoint(context: string, fallback: string): { type: LogoType, logo: string } {
  const logos = files.logo
  const logo = filesResolve(context, logos.slice(0, -1))
  if(logo) return { type: LogoType.Normal, logo }
  const ico = filesResolve(context, logos.slice(-1))
  if(ico) return { type: LogoType.Ico, logo: ico }
  return { type: LogoType.Normal, logo: fallback }
}

export default function createLogoConfig(context: string, options: Partial<LogoConfigOptions> = {}): webpack.Configuration {
  const opts = { ...DEFAULT_LOGOCONFIGOPTIONS, ...options }
  const logo = resolveLogoEntrypoint(context, opts.entry)

  return {
    entry: `!${LogoLoader}!${UrlLoader}!${logo.logo}`,
    plugins: [
      new FaviconsWebpackPlugin({
        logo: logo.logo,
        inject: 'force',
        cache: false,
        prefix: opts.context
      })
    ]
  }
}