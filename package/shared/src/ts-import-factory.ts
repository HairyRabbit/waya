import * as createDebug from 'debug'
import * as ts from 'typescript'

const debug = createDebug('ts-transform-import-factory')

export function transformImportFactory<T extends ts.Node>(libraryName: string, factoryName: string): ts.TransformerFactory<T> {
  return context => {
    const visitor: ts.Visitor = node => {
      if (ts.isSourceFile(node)) {
        const fileName = node.getSourceFile().fileName
        if(!fileName.endsWith(`.tsx`)) return node
        debug(`Found "${fileName}"`)

        const decl = node.statements
          .filter((stmt): stmt is ts.ImportDeclaration => ts.isImportDeclaration(stmt))
          .find(decl => isLibImportModuleSpecifier(decl, libraryName))

        if(undefined !== decl) return ts.visitEachChild(node, visitor, context)

        debug(`Transform **Append**`)
        
        return ts.updateSourceFileNode(
          node,
          [
            ts.createImportDeclaration(
              undefined,
              undefined,
              ts.createImportClause(
                ts.createIdentifier(factoryName),
                undefined
              ),
              ts.createStringLiteral(libraryName)
            ),
            ...node.statements
          ],
          node.isDeclarationFile,
          node.referencedFiles,
          node.typeReferenceDirectives,
          node.hasNoDefaultLib,
          node.libReferenceDirectives
        )
      }
      else if(ts.isImportDeclaration(node)) {
        if(!isLibImportModuleSpecifier(node, libraryName)) return node
        return ts.visitEachChild(node, visitor, context)
      }
      else if(ts.isImportClause(node)) {
        const clause = node
        const name = clause.name
        if(undefined !== name) return node
        debug(`Transform **Override**`)
        return ts.updateImportClause(node, ts.createIdentifier(factoryName), node.namedBindings)
      }
      else return node
    }

    return node => ts.visitNode(node, visitor)
  }
}

function isLibImportModuleSpecifier(node: ts.ImportDeclaration, lib: string): boolean {
  const specifier = node.moduleSpecifier
  return ts.isStringLiteral(specifier) && lib === specifier.text
}

export default transformImportFactory