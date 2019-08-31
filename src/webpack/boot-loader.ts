import * as webpack from 'webpack'
import * as path from 'path'
import { getOptions } from 'loader-utils'

interface Options {
  store: string,
  strict: boolean,
  pages: string
}

interface Context {
  entry: string
  mountNode: string
  store?: string
  strict: boolean
  page: boolean
}

export function pitch(this: webpack.loader.LoaderContext, remainingRequest: string) {
  this.cacheable && this.cacheable(true)

  const options: Partial<Readonly<Options>> = getOptions(this) || {}
  const url = JSON.stringify('-!' + remainingRequest)

  const context = {
    entry: url,
    mountNode: JSON.stringify(`app`),
    store: options.store ? JSON.stringify('-!' + this.loaders[1].request + '!' + options.store) : undefined,
    strict: options.strict || true,
    page: path.dirname(remainingRequest).endsWith(options.pages || 'pages')
  }

  return gen(context)
}
///*include: [/.*/],*/
export function gen(context: Context): string {
  return [
    `import { render } from 'react-dom';`,
    // // `import WDYR from '@welldone-software/why-did-you-render'`,
    // `const wdyr = WDYR(React, {  exclude: [/^(BrowserRouter|Router|Provider)$/], logOnDifferentValues: true })`,

    `export default async function main() {`,
      `const app = require(${context.entry}).default`,
      `const node = document.getElementById(${context.mountNode})`,
      `return render(app, node)`,
    `}`,

    `main();`
  ].join(`\n`)
}