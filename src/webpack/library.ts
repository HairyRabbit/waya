import * as webpack from 'webpack'
import * as path from 'path'

export const enum LibraryType { Script, Style, Unknown }

export type Library = {
  name: string,
  type: LibraryType,
  globalName?: string,
}

export const BUILDIN_LIBS: Map<string, Library> = new Map([
  [ 'react', { name: 'react', type: LibraryType.Script, globalName: 'React' } ],
  [ 'react-dom', { name: 'react-dom', type: LibraryType.Script, globalName: 'ReactDOM' } ],
  [ 'react-router-dom', { name: 'react-router-dom', type: LibraryType.Script, globalName: 'ReactRouterDOM' } ],
  [ 'redux', { name: 'react-redux', type: LibraryType.Script, globalName: 'Redux' } ],
  [ 'react-redux', { name: 'react-redux', type: LibraryType.Script, globalName: 'ReactRedux' } ],
  [ 'normalize.css', { name: 'normalize.css', type: LibraryType.Style } ],
  [ 'sanitize.css', { name: 'sanitize.css', type: LibraryType.Style } ],
  [ 'style-extra', { name: 'style-extra', type: LibraryType.Unknown } ],
  [ '@babel/polyfill', { name: '@babel/polyfill', type: LibraryType.Unknown }]
])

type LibraryOptions = {
  alias: { [key: string]: string },
  externals: { [key: string]: string },
  style: { [key: string]: string },
  script: { [key: string]: string },
  plugins: { [key: string]: webpack.PrefetchPlugin }
}

export default function getLibraryOptions(): LibraryOptions {
  const acc: LibraryOptions = Object.create(null)
  acc.alias = Object.create(null)
  acc.externals = Object.create(null)
  acc.style = Object.create(null)
  acc.script = Object.create(null)
  acc.plugins = Object.create(null)

  BUILDIN_LIBS.forEach(lib => {
    const { name, type, globalName } = lib
    const modulePath = LibraryType.Unknown === type
      ? path.dirname(require.resolve(name + '/package.json'))
      : require.resolve(name)
    
    acc.alias[name] = modulePath
    if(globalName) acc.externals[name] = globalName
    if(LibraryType.Unknown !== type) acc.plugins[name] = new webpack.PrefetchPlugin(path.dirname(modulePath), name)
  })

  return acc
}