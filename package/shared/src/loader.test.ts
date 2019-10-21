import { Loader, createLoaderUse } from './loader'

describe(`function createLoaderUse`, () => {
  test(`default`, () => {
    expect(createLoaderUse(Loader.TS)).toEqual({ loader: require.resolve('ts-loader') })
  })

  test(`has options`, () => {
    expect(createLoaderUse(Loader.TS, {})).toEqual({ loader: require.resolve('ts-loader'), options: {} })
  })
})