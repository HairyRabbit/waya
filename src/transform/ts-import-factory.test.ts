import { Project, ts } from 'ts-morph'
import transform from './ts-import-factory'

describe(`transformImportProvider()`, () => {
  describe(`react`, () => {
    test(`no import`, () => {
      const code = `\
<div />
`
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

function print(code: string, file: string = `tmp.tsx`): string {
  const proj = new Project({
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React
    }
  })
  proj.createSourceFile(file, code)
  const result = proj.emitToMemory({
    customTransformers: {
      before: [ transform(`react`, `React`) ]
    }
  })
  const resolved = result.getFiles()[0].text
  return resolved
}
