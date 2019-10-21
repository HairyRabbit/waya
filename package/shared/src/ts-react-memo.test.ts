import createPrint from './ts-transform-print'
import transformReactMemo from './ts-react-memo'

const print = createPrint({
  before: [
    checker => transformReactMemo(checker)
  ]
})

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

