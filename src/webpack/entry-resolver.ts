import * as path from 'path'
import * as fs from 'fs'
import * as files from './controlled-files.json'

const BootLoader = require.resolve('./boot-loader')
const RootLoader = require.resolve('./root-loader')
// const RootCssvarLoader = require.resolve('./root-cssvar-loader')

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
  const scriptEntry = filter(context, files.app)
  const styleEntry = filter(context, files.style)
  const storeEntry = filter(context, files.store)
  const cssvarEntry = filter(context, files.cssvar)
  
  const rootLoaderOptions = makeRootLoaderOptions({
    store: storeEntry,
  })

  return [
    ...prepends,
    cssvarEntry,
    styleEntry,
    [ 
      BootLoader,
      RootLoader + '?' + rootLoaderOptions, 
      scriptEntry 
    ].filter((filePath): filePath is string => null !== filePath).join('!')
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