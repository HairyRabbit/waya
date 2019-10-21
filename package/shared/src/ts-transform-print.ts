import * as ts from 'typescript'

type Transformer = {
  before?: Array<(checker: ts.TypeChecker) => (ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory)>
  after?: Array<(checker: ts.TypeChecker) => (ts.TransformerFactory<ts.SourceFile> | ts.CustomTransformerFactory)>
}

function createPrint(transformers: Transformer) {
  return (code: string, fileName: string = `tmp.tsx`, ) :string => {
    
    const compilerOptions = {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.React,
      newLine: ts.NewLineKind.LineFeed
    }
    const program = ts.createProgram([fileName], compilerOptions)
    const checker = program.getTypeChecker()

    const result = ts.transpileModule(code, {
      compilerOptions,
      fileName,
      transformers: {
        before: transformers.before!.map(transform => transform(checker)),
        after: transformers.before!.map(transform => transform(checker)),
      }
    })
    return result.outputText
  }
}

export default createPrint