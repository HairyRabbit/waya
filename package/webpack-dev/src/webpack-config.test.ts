import createWebpackConfig from './webpack-config'

describe(`createWebpackConfig`, () => {
  test(`default`, () => {
    // expect(
    //   createWebpackConfig({
    //     context: '.'
    //   })
    // ).toStrictEqual({
    //   context: '.'
    // })
    console.log(
      createWebpackConfig({
        context: '.',
        project: '.',
        pkg: { name: 'app', version: '0.0.0', _id: 'app', readme: '' },
        entry: {
          script: [],
          style: []
        },
        fallbacks: [],
        style: {
          globals: '',
          cssvar: ''
        },
        logo: '',
        library: {
          context: '.',
          include: {
            style: [],
            script: []
          }
        },
        url: new URL('http://localhost:8080'),
        lang: 'zh',
        locales: '.',
        image: '.',
        icon: '.'
      })
    )
  })
})