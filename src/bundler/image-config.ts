import * as webpack from 'webpack'

const UrlLoader: string = require.resolve('url-loader')
const ImageWebpackLoader: string = require.resolve('image-webpack-loader')

interface ImageConfigOptions {
  readonly isProduction: boolean
}

export default function createImageConfig(options: ImageConfigOptions): webpack.Configuration {
  const { isProduction } = options
  return {
    module: {
      rules: [{
        test: /\.(jpe?g|png|gif|svg|webp)$/,
        use: [{
          loader: UrlLoader,
          options: {}
        }, {
          loader: ImageWebpackLoader,
          options: {
            disable: isProduction
          }
        }]
      }]
    },
    plugins: [

    ]
  }
}