import * as React from 'react'
import { hydrate } from 'react-dom'

declare namespace globalThis {
  var Application: { default: React.ReactElement }
}

hydrate(globalThis.Application.default, document.getElementById('app'))