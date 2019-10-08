import { ts, Project } from 'ts-morph'
import { transformReactMemo } from './ts-react-memo'

describe(`transformReactMemo()`, () => {
  test(`export assignment`, () => {
    const code = `function foo(){};export default foo;`
    expect(print(code)).toBe(`function foo() { }\n;\nexport default React.memo(foo);\n`)
  })

  test(`export default function`, () => {
    const code = `export default function foo(){};`
    expect(print(code)).toBe(`function foo() { }\n;\nexport default React.memo(foo);\n`)
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
      before: [ transformReactMemo(proj.getTypeChecker().compilerObject) ]
    }
  })
  const resolved = result.getFiles()[0].text
  return resolved
}
