import * as webpack from 'webpack'
import { getOptions } from 'loader-utils'

export default function loader(data: string) { return data }

interface Context {
  entry: string
  mountNode: string
  store?: string
}

export function pitch(this: webpack.loader.LoaderContext, remainingRequest: string) {
  this.cacheable && this.cacheable(true)

  const options = getOptions(this) || {}
  const url = JSON.stringify('-!' + remainingRequest)
  const context = {
    entry: url,
    mountNode: JSON.stringify(`app`),
    store: options.store ? JSON.stringify('-!' + this.loaders[1].request + '!' + options.store) : undefined
  }

  return gen(context)
}
///*include: [/.*/],*/
export function gen(context: Context): string {
  return [
    `import * as React from 'react';`,
    `import { render } from 'react-dom';`,
    `import { BrowserRouter as Router } from 'react-router-dom'`,
    `import WDYR from '@welldone-software/why-did-you-render'`,
    context.store ? `import { Provider } from 'react-redux'` : '',
    `import ensureNode from 'util-extra/dom/ensureNode'`,

    `const wdyr = WDYR(React, {  exclude: [/^(BrowserRouter|Router|Provider)$/], logOnDifferentValues: true })`,

    `export default async function main() {`,
      `const Root = require(${context.entry}).default`,
      context.store ? `const store = require(${context.store}).default` : '',
      `const node = React.createElement(React.StrictMode, undefined,`,
        `React.createElement(Router, undefined,`,
          context.store ? `React.createElement(Provider, { store },` : '',
            `React.createElement(Root)`,
          context.store ? `)` : '',
        `)`,
      `)`,
      `return render(node, ensureNode(${context.mountNode}))`,
    `}`,

    `main();`
  ].filter(Boolean).join(`\n`)
}
