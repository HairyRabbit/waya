import * as ts from 'typescript'

export default function transformPackagePath (program: ts.Program, pluginOptions: {}) {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      function visitor(node: ts.Node): ts.Node {
        // if(ts.isImport)
        console.log(node)
      }
      
      return ts.visitEachChild(sourceFile, visitor, ctx)
    }
  }
}