import * as webpack from 'webpack'
import createDefaultConfig, { DEFAULT_EXTENSIONS } from './default-config'

describe(`createDefaultConfig`, () => {
  test(`default`, () => {
    expect(
      createDefaultConfig({ context: '.' })
    ).toStrictEqual({
      mode: 'development',
      name: 'app-dev',
      context: '.',
      devtool: 'inline-source-map',
      output: {
        publicPath: '/'
      },
      resolve: { 
        extensions: DEFAULT_EXTENSIONS,
        alias: {
          '@': '.'
        }
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    })
  })

  test(`options.name`, () => {
    expect(
      createDefaultConfig({ context: '.', name: 'foo' })
    ).toStrictEqual({
      mode: 'development',
      name: 'foo-dev',
      context: '.',
      devtool: 'inline-source-map',
      output: {
        publicPath: '/'
      },
      resolve: { 
        extensions: DEFAULT_EXTENSIONS,
        alias: {
          '@': '.'
        }
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    })
  })

  test(`options.modulesContext`, () => {
    expect(
      createDefaultConfig({ context: '.', modulesContext: 'foo' })
    ).toStrictEqual({
      mode: 'development',
      name: 'app-dev',
      context: '.',
      devtool: 'inline-source-map',
      output: {
        publicPath: '/'
      },
      resolve: { 
        extensions: DEFAULT_EXTENSIONS,
        alias: {
          '@': '.'
        },
        modules: [
          'node_modules',
          'foo'
        ]
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin()
      ]
    })
  })
})