import { Project, printNode, ts } from 'ts-morph'
import * as path from 'path'

enum RouterType {
  Client = 'BrowserRouter',
  Server = 'StaticRouter'
}

interface Options {
  store: string | null
  strict: boolean
  router: RouterType | null
}

const DEFAULT_OPTIONS: Options = {
  store: null,
  strict: true,
  router: RouterType.Client
}

export default function GenerateWrapper(entry: string, options: Partial<Readonly<Options>> = {}): { result: string, map: { file: string, content: string }} {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const nodes = makeNodes(entry, opts)
  const code = nodes.map(node => printNode(node)).join('\n')
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, './tsconfig.json')
  })
  const sf = project.createSourceFile('__WRAPPER_GENERATOR__.tsx', code)
  const [ map, result ] = sf.getEmitOutput().getOutputFiles()
  return {
    result: result.getText(),
    map: {
      file: map.getFilePath(),
      content: map.getText()
    }
  }
}

export function makeNodes(entry: string, options: Options): ts.Node[] {
  const imports = []
  let node

  imports.push(
    ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        ts.createIdentifier('Root'), undefined
      ),
      ts.createStringLiteral(entry)
    )
  )
  
  node = (
    ts.createJsxSelfClosingElement(
      ts.createIdentifier('Root'),
      undefined,
      ts.createJsxAttributes([])
    )
  )


  if(options.store) {
    imports.push(
      ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamedImports(
            [
              ts.createImportSpecifier(
                undefined, 
                ts.createIdentifier('Provider')
              )
            ]
          )
        ),
        ts.createStringLiteral('redux')
      )
    )
    
    node = makeStoreProviderNode(node)
  }

  if(null !== options.router) {
    imports.push(
      ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamedImports(
            [
              ts.createImportSpecifier(
                ts.createIdentifier(options.router),
                ts.createIdentifier('Router')
              )
            ]
          )
        ),
        ts.createStringLiteral('react-router-dom')
      )
    )
    
    node = makeRouterNode(node)
  }

  if(options.strict) {
    imports.push(
      ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          ts.createIdentifier('React'),
          ts.createNamedImports(
            [
              ts.createImportSpecifier(
                undefined, 
                ts.createIdentifier('StrictMode')
              )
            ]
          )
        ),
        ts.createStringLiteral('react')
      )
    )
    node = makeStrictModeNode(node)
  } else {
    imports.push(
      ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          ts.createIdentifier('React'),
          undefined
        ),
        ts.createStringLiteral('react')
      )
    )
  }

  return [
    ...imports,

    // ts.createFunctionDeclaration(
    //   undefined,
    //   [
    //     ts.createModifier(ts.SyntaxKind.ExportKeyword),
    //     ts.createModifier(ts.SyntaxKind.DefaultKeyword)
    //   ],
    //   undefined,
    //   ts.createIdentifier('Wrapper'),
    //   undefined,
    //   [],
    //   undefined,
    //   ts.createBlock(
    //     [
    //       ts.createReturn(node)
    //     ],
    //     true
    //   )
    // )
    ts.createExportAssignment(
      undefined,
      undefined,
      undefined,
      node
    )
  ]
}

function makeStrictModeNode(children: ts.JsxChild): ts.JsxElement {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createIdentifier('StrictMode'), 
      undefined, 
      ts.createJsxAttributes([])
    ),
    [
      children
    ],
    ts.createJsxClosingElement(
      ts.createIdentifier('StrictMode')
    )
  )
}

function makeRouterNode(children: ts.JsxChild): ts.JsxElement {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createIdentifier('Router'), 
      undefined, 
      ts.createJsxAttributes([])
    ),
    [
      children
    ],
    ts.createJsxClosingElement(
      ts.createIdentifier('Router')
    )
  )
}

function makeStoreProviderNode(children: ts.JsxChild): ts.JsxElement {
  return ts.createJsxElement(
    ts.createJsxOpeningElement(
      ts.createIdentifier('Provider'), 
      undefined, 
      ts.createJsxAttributes([
        ts.createJsxAttribute(
          ts.createIdentifier('store'),
          ts.createJsxExpression(
            undefined, 
            ts.createIdentifier('store')
          )
        )
      ])
    ),
    [
      children
    ],
    ts.createJsxClosingElement(
      ts.createIdentifier('Provider')
    )
  )
}