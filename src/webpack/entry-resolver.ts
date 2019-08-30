import * as path from 'path'
import * as fs from 'fs'

const ScriptMatches: string[] = ['index.ts', 'App.tsx', 'view/index.ts', 'view/App.tsx', 'view/index.tsx']
const StyleMatches: string[] = [
  'style.scss', 'style.css',
  'index.scss', 'index.css',
  'style/index.scss', 'style/index.css',
  'style/style.scss', 'style/style.css'
]

const BootLoader = require.resolve('./boot-loader')

export default function resolveEntry(context: string, prepends: string[] = []): string[] {
  const scriptEntry = filter(context, ScriptMatches)
  const styleEntry = filter(context, StyleMatches)

  return [
    ...prepends,
    styleEntry,
    BootLoader + '!' + scriptEntry
  ].filter((entry): entry is string => undefined !== entry)
}

function filter(context: string, matches: string[]): string | undefined {
  return matches.map(filePath => {
    const absoluteFilePath = path.resolve(context, filePath)
    const isExists = fs.existsSync(absoluteFilePath)
    return isExists ? absoluteFilePath : null
  }).find((filePath): filePath is string => null !== filePath)
}