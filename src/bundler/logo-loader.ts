import * as webpack from 'webpack'
import * as loaderUtils from 'loader-utils'

export function pitch(this: webpack.loader.LoaderContext, request: string) {
  const stringifyRequest = loaderUtils.stringifyRequest(this, `!!${request}`)
  return `\
import { setIconLinkTag, getImageDataUrl } from 'util-extra'

async function update(url, options) {
  const data = await getImageDataUrl(url, { size: 32 })
  setIconLinkTag(data, undefined, { type: 'image/png' })
}

if (module.hot) {
  module.hot.accept(${stringifyRequest}, () => {
    update(require(${stringifyRequest}))
  })
  
  module.hot.dispose()
}

update(require(${stringifyRequest}))
`
}