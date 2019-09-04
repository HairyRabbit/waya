import { Project, printNode, ts } from 'ts-morph'
import * as path from 'path'

const TSConfig = path.resolve(__dirname, './default-tsconfig.json')

interface Options {
  store: string | null
  strict: boolean
  router: boolean
}

const DEFAULT_OPTIONS: Options = {
  store: null,
  strict: true,
  router: false
}

export default function GenerateWrapper(entry: string, options: Partial<Readonly<Options>> = {}): { result: string, map: { file: string, content: string }} {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const nodes = makeNodes(entry, opts)
  const code = nodes.map(node => printNode(node)).join('\n')
  const project = new Project({
    tsConfigFilePath: TSConfig
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
          ts.createIdentifier('store'), undefined
        ),
        ts.createStringLiteral(options.store)
      )
    )

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
        ts.createStringLiteral('react-redux')
      )
    )
    
    node = makeStoreProviderNode(node)
  }

  if(options.router) {
    imports.push(
      ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamespaceImport(ts.createIdentifier('router'))
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

    ...options.router ? [
      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList(
          [
            ts.createVariableDeclaration(
              ts.createIdentifier('RouterProps'),
              undefined,
              ts.createPropertyAccess(
                ts.createIdentifier('globalThis'),
                ts.createIdentifier('RouterProps')
              )
            )
          ],
          ts.NodeFlags.Const
        )
      ),

      ts.createVariableStatement(
        undefined,
        ts.createVariableDeclarationList(
          [
            ts.createVariableDeclaration(
              ts.createIdentifier('Router'),
              undefined,
              ts.createConditional(
                ts.createPropertyAccess(
                  ts.createIdentifier('globalThis'),
                  ts.createIdentifier('document')
                ),
                ts.createPropertyAccess(
                  ts.createIdentifier('router'),
                  ts.createIdentifier('BrowserRouter')
                ),
                ts.createPropertyAccess(
                  ts.createIdentifier('router'),
                  ts.createIdentifier('StaticRouter')
                )
              )
            )
          ],
          ts.NodeFlags.Const
        )
      ),
    ] : [],

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
      ts.createJsxAttributes([
        ts.createJsxSpreadAttribute(ts.createIdentifier('RouterProps'))
      ])
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