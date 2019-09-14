import * as path from 'path'
// import * as fs from 'fs'
import * as files from './controlled-files.json'
import fileResolve from './files-resolver'

// const BootLoader = require.resolve('./boot-loader')
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
  const { prepends } = { ...DEFAULT_OPTIONS, ...options }
  // console.log(prepends)
  // const scriptEntry = filter(context, files.app)
  const styleEntry = fileResolve(context, files.style)
  // const storeEntry = filter(context, files.store)
  const cssvarEntry = fileResolve(context, files.cssvar)
  
  // const rootLoaderOptions = makeRootLoaderOptions({
  //   store: storeEntry,
  // })

  return [
    ...prepends,
    cssvarEntry,
    styleEntry,
    [ RootLoader, path.resolve(context, 'boot.ts') ].join('!')
    // [ 
    //   // BootLoader,
    //   // RootLoader + '?' + rootLoaderOptions, 
    //   // scriptEntry 
    //   path.resolve(context, 'boot.ts')
    // ].filter((filePath): filePath is string => null !== filePath).join('!')
  ].filter((entry): entry is string => undefined !== entry)
}

// function makeRootLoaderOptions({ store }: { store: string | undefined }) {
//   const params = new URLSearchParams
//   store && params.append('store', store)
//   return params.toString()
// }