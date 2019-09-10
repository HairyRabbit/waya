import * as webpackMerge from 'webpack-merge'
import * as path from 'path'
import * as HTMLWebpackPlugin from 'html-webpack-plugin'
import createRunner from './test-runner'
import createLogoConfig from './logo-config'

const merge = webpackMerge.smartStrategy({})

describe(`default`, () => {
  test('export logo config', () => {
    expect(createLogoConfig()).toMatchSnapshot('default')
  })
})

describe(`merge`, () => {
  test(`plugin`, () => {
    const config = {
      plugins: [
        new (class { apply(){} })
      ]
    }
    expect(merge(config, createLogoConfig())).toMatchSnapshot('merge plugin')
  })
})

describe(`run`, () => {
  test(`default`, async () => {
    const context = path.resolve(__dirname, '../../dist')
    const logo = path.resolve(context, 'favicon.ico')
    const config = createLogoConfig({ logo: '/favicon.ico' })
    const res = await createRunner({ context })
      .addFile('./src/index.js')
      .addFileFrom(logo)
      .run(config)
    return expect(res).toMatchSnapshot('run default')
  })

  test(`with html`, async () => {
    const context = path.resolve(__dirname, '../../dist')
    const logo = path.resolve(context, 'favicon.ico')
    const config = createLogoConfig({ logo })
    const entry = path.resolve(context, 'package.json')
    const runner = createRunner({ disableIFS: true })
    const res = await runner.run(merge({
        entry,
        plugins: [ new HTMLWebpackPlugin() ]
      }, config))
    expect(res).toMatchSnapshot('run with html')
    expect(runner.ofs.readFileSync('/index.html', 'utf-8')).toMatchSnapshot('run with html content')
    return
  })
})