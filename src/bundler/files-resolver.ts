import * as fs from 'fs'
import * as path from 'path'

export default function resolveFile(context: string, matches: string[]): string | undefined {
  return matches.map(filePath => {
    const absoluteFilePath = path.resolve(context, filePath)
    const isExists = fs.existsSync(absoluteFilePath)
    return isExists ? absoluteFilePath : null
  }).find((filePath): filePath is string => null !== filePath)
}