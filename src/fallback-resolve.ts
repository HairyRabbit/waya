import * as path from 'path'
import * as fs from 'fs'

export default function fallbackResolve(name: string, context: string, fallbackContext: string): string {
  const targetPath = path.resolve(context, name)
  const fallbackPath = path.resolve(fallbackContext, name)
  if(fs.existsSync(targetPath)) return targetPath
  return fallbackPath
}