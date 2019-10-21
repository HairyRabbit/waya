import createPrint from './ts-transform-print'
import transformImportFactory from './ts-import-factory'

const print = createPrint({
  before: [
    () => transformImportFactory('react', 'React')
  ]
})

describe(`transformImportProvider()`, () => {
  describe(`react`, () => {
    test(`no import`, () => {
      const code = `<div />`
      const resolved = print(code)
      expect(resolved).toBe(`\
import React from "react";
React.createElement("div", null);
`)
    })

    test(`no name`, () => {
      const code = `\
import { Component } from 'react';
<div />
`
      const resolved = print(code)
      expect(resolved).toBe(`\
import React, { Component } from 'react';
React.createElement("div", null);
`)
    })

    test(`have name`, () => {
      const code = `\
import React from 'react';
<div />
`
      const resolved = print(code)
      expect(resolved).toBe(`\
import React from 'react';
React.createElement("div", null);
`)
    })
  })

  test(`not tsx file`, () => {
    const code = `42`
      const resolved = print(code, `tmp.ts`)
      expect(resolved).toBe(`42;\n`)
  })
})