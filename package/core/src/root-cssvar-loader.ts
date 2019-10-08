import * as webpack from 'webpack'

export function rootCssloader(this: webpack.loader.LoaderContext, data: string) {
  this.cacheable && this.cacheable(true)
  const result = transformJson(JSON.parse(data))
  if(0 === result.length) return ''
  return `:root {\n  ${result.join('\n')}\n}`
}

function transformJson(json: { [key: string]: string }): string[] {
  return Object.keys(json).reverse().reduce<string[]>((acc, key) => {
    const value = json[key]
    const prop = key.startsWith(`--`) ? key : `--` + key
    acc.push(`  ${prop}: ${value}`)
    return acc
  }, [])
}