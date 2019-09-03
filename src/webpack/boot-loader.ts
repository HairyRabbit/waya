import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'

interface Context {
  entry: string,
  mountNode: string,
  ssr: boolean
}

export function pitch(this: webpack.loader.LoaderContext, remainingRequest: string) {
  this.cacheable && this.cacheable(true)

  const url = JSON.stringify('-!' + remainingRequest)
  const options = getOptions(this) || {}

  const context = {
    entry: url,
    mountNode: JSON.stringify(`app`),
    ssr: options.ssr || false
  }

  return gen(context)
}
///*include: [/.*/],*/
export function gen(context: Context): string {
  return [
    `import { ${context.ssr ? 'hydrate' : 'render'} } from 'react-dom';`,
    // // `import WDYR from '@welldone-software/why-did-you-render'`,
    // `const wdyr = WDYR(React, {  exclude: [/^(BrowserRouter|Router|Provider)$/], logOnDifferentValues: true })`,

    `export default async function main() {`,
      `const app = require(${context.entry}).default`,
      `const node = document.getElementById(${context.mountNode})`,
      `return ${context.ssr ? 'hydrate' : 'render'}(app, node)`,
    `}`,

    `main();`
  ].join(`\n`)
}