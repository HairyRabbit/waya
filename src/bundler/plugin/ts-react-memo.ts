import * as createDebug from 'debug'
import * as ts from 'typescript'

const debug = createDebug('ts-transform-react-memo')

export default function transformImportProvider<T extends ts.Node>(checker: ts.TypeChecker): ts.TransformerFactory<T> {
  return context => {
    const visitor: ts.Visitor = node => {
      if (ts.isSourceFile(node)) {
        const fileName = node.getSourceFile().fileName
        if(!fileName.endsWith(`.tsx`)) return node
        debug(`Found "${fileName}"`)

        const decl = node.statements.find((stmt): stmt is ts.FunctionDeclaration => ts.isFunctionDeclaration(stmt) && isFunctionDeclarationDefaultExported(stmt))
        if(undefined === decl) return ts.visitEachChild(node, visitor, context)
        const iden = decl.name
        if(undefined === iden) return ts.visitEachChild(node, visitor, context)

        decl.modifiers = decl.modifiers ? ts.createNodeArray(decl.modifiers.filter(modifier => !(modifier.kind === ts.SyntaxKind.DefaultKeyword || modifier.kind === ts.SyntaxKind.ExportKeyword))) : undefined
        debug(`Transformed FunctionDeclaration "${iden.getText()}"`)

        return ts.updateSourceFileNode(
          node,
          [
            ...node.statements,
            ts.createExportAssignment(
              undefined,
              undefined,
              undefined,
              ts.createCall(
                ts.createPropertyAccess(
                  ts.createIdentifier('React'),
                  ts.createIdentifier('memo')
                ),
                undefined,
                [iden]
              )
            )
          ],
          node.isDeclarationFile,
          node.referencedFiles,
          node.typeReferenceDirectives,
          node.hasNoDefaultLib,
          node.libReferenceDirectives
        )
      }
      else if(ts.isExportAssignment(node)) {
        const iden = node.expression
        if(!ts.isIdentifier(iden)) return node
        const type = checker.getTypeAtLocation(iden)
        const symbol = type.getSymbol()
        if(undefined === symbol) return node
        const decl = symbol.valueDeclaration
        if(!ts.isFunctionDeclaration(decl)) return node
        debug(`Transformed ExportAssignment "${iden.getText()}"`)
        return ts.updateExportAssignment(
          node, 
          node.decorators,
          node.modifiers,
          ts.createCall(
            ts.createPropertyAccess(
              ts.createIdentifier('React'),
              ts.createIdentifier('memo')
            ),
            undefined,
            [iden]
          )
        )
      }
      else return node
    }

    return node => ts.visitNode(node, visitor)
  }
}


function isFunctionDeclarationDefaultExported(node: ts.FunctionDeclaration): boolean {
  return Boolean(
    node.modifiers 
    && node.modifiers[0] && node.modifiers[0].kind === ts.SyntaxKind.ExportKeyword 
    && node.modifiers[1] && node.modifiers[1].kind === ts.SyntaxKind.DefaultKeyword
  )
}
