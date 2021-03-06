import * as webpack from 'webpack'
import * as createDebugger from 'debug'

const debug = createDebugger('style-json-loader')

export function styleJsonLoader(this: webpack.loader.LoaderContext, data: string) {
  this.cacheable && this.cacheable(true)
  const result = transformJson(JSON.parse(data))
  if(0 === result.length) return ''
  const ret = `:root {\n${result.join('\n')}\n}`
  debug(ret)
  return ret
}

styleJsonLoader.filePath = __filename

function transformJson(json: { [key: string]: string }): string[] {
  return Object.keys(json).reverse().reduce<string[]>((acc, key) => {
    const value = json[key]
    const prop = key.startsWith(`--`) ? key : `--` + key
    acc.push(`  ${prop}: ${value};`)
    return acc
  }, [])
}

export default styleJsonLoader