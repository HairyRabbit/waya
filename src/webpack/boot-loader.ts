import * as webpack from 'webpack'

export function pitch(this: webpack.loader.LoaderContext, remainingRequest: string) {
  this.cacheable && this.cacheable(true)

  const url = JSON.stringify('-!' + remainingRequest)

  const context = {
    entry: url,
    mountNode: JSON.stringify(`app`),
  }

  return gen(context)
}
///*include: [/.*/],*/
export function gen(context: { entry: string, mountNode: string }): string {
  return [
    `import { hydrate, render } from 'react-dom';`,
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