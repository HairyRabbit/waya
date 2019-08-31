import * as path from 'path'
import * as fs from 'fs'

const ScriptMatches: string[] = [
  'index.ts', 'index.tsx',
  'App.tsx', 
  'pages/index.ts', 'view/index.tsx',
  'pages/App.tsx'
]
const StyleMatches: string[] = [
  'style.scss', 'style.css',
  'index.scss', 'index.css',
  'style/index.scss', 'style/index.css',
  'style/style.scss', 'style/style.css'
]

const RootLoader = require.resolve('./root-loader')
const BootLoader = require.resolve('./boot-loader')

interface Options {
  prepends: string[],
  isProduction: boolean
}

const DEFAULT_OPTIONS: Options = {
  prepends: [],
  isProduction: false
}

export default function resolveEntry(context: string, options: Partial<Readonly<Options>> = {}): string[] {
  const { prepends, isProduction } = { ...DEFAULT_OPTIONS, ...options }
  const scriptEntry = filter(context, ScriptMatches)
  const styleEntry = filter(context, StyleMatches)

  return [
    ...prepends,
    styleEntry,
    [ isProduction ? null : BootLoader, RootLoader, scriptEntry ]
      .filter((filePath): filePath is string => null !== filePath)
      .join('!')
  ].filter((entry): entry is string => undefined !== entry)
}

function filter(context: string, matches: string[]): string | undefined {
  return matches.map(filePath => {
    const absoluteFilePath = path.resolve(context, filePath)
    const isExists = fs.existsSync(absoluteFilePath)
    return isExists ? absoluteFilePath : null
  }).find((filePath): filePath is string => null !== filePath)
}