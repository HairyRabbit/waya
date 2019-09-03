import * as React from 'react'
import { hydrate } from 'react-dom'
// import { loadableReady } from '@loadable/component'

declare namespace globalThis {
  var Application: { default: React.ReactElement }
}

hydrate(globalThis.Application.default, document.getElementById('app'))