import * as path from 'path'
import * as fs from 'fs'

const ScriptMatches: string[] = [
  'index.ts', 'index.tsx',
  'App.tsx', 
  'pages/index.ts', 'pages/index.tsx',
  'pages/App.tsx'
]
const StyleMatches: string[] = [
  'style.scss', 'style.css',
  'index.scss', 'index.css',
  'style/index.scss', 'style/index.css',
  'style/style.scss', 'style/style.css'
]
const StoreScriptMatches: string[] = [
  'store.ts',
  'actions/index.ts'
]

const BootLoader = require.resolve('./boot-loader')
const RootLoader = require.resolve('./root-loader')

interface Options {
  prepends: string[],
  isProduction: boolean
}

const DEFAULT_OPTIONS: Options = {
  prepends: [],
  isProduction: false
}

export default function resolveEntry(context: string, options: Partial<Readonly<Options>> = {}): string[] {
  const { prepends, } = { ...DEFAULT_OPTIONS, ...options }
  const scriptEntry = filter(context, ScriptMatches)
  const styleEntry = filter(context, StyleMatches)
  const storeEntry = filter(context, StoreScriptMatches)
  
  const rootLoaderOptions = makeRootLoaderOptions({
    store: storeEntry,
  })

  return [
    ...prepends,
    styleEntry,
    [ 
      BootLoader,
      RootLoader + '?' + rootLoaderOptions, 
      scriptEntry 
    ]
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

function makeRootLoaderOptions({ store }: { store: string | undefined }) {
  const params = new URLSearchParams
  store && params.append('store', store)
  return params.toString()
}