import * as webpack from 'webpack'
import * as path from 'path'
import * as libraries from './library.json'

export const enum LibraryType { Script = 'script', Style = 'style', Unknown = 'unknown' }

export type Library = {
  name: string,
  type: LibraryType,
  globalName?: string,
  bundle?: string | string[]
}

type LibraryOptions = {
  alias: { [key: string]: string },
  externals: { [key: string]: string },
  style: string[],
  script: string[],
  plugins: { [key: string]: webpack.PrefetchPlugin }
}

export default function getLibraryOptions(): LibraryOptions {
  const acc: LibraryOptions = Object.create(null)
  acc.alias = Object.create(null)
  acc.externals = Object.create(null)
  acc.style = []
  acc.script = []
  acc.plugins = Object.create(null)

  for (const name in libraries) {
    if (libraries.hasOwnProperty(name)) {
      const library = libraries[name as keyof typeof libraries]
      const { type, globalName, bundle } = library
      const modulePath = LibraryType.Unknown === type
        ? path.dirname(require.resolve(name + '/package.json'))
        : require.resolve(name)
      
      acc.alias[name] = modulePath
      if(globalName) acc.externals[name] = globalName
      if(LibraryType.Unknown !== type) acc.plugins[name] = new webpack.PrefetchPlugin(path.dirname(modulePath), name)

      switch(type) {
        case LibraryType.Script: {
          const bundles = Array.isArray(bundle) ? bundle : [ bundle ]
          bundles.forEach(bundle => {
            acc.script.push(`https://unpkg.com/${name}/${bundle}`)
          })
          break;
        }
        case LibraryType.Style: {
          const bundles = Array.isArray(bundle) ? bundle : [ bundle ]
          bundles.forEach(bundle => {
            acc.style.push(`https://unpkg.com/${name}/${bundle}`)
          })
          break;
        }
        default: break;
      }
      
    }
  }

  return acc
}