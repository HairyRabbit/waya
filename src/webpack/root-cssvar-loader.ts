import * as webpack from 'webpack'

export default function loader(this: webpack.loader.LoaderContext, data: string) {
  this.cacheable && this.cacheable(true)
  const result = transformJson(JSON.parse(data))
  return `\
:root {
  ${result}
}`
}

function transformJson(json: { [key: string]: string }): string {
  return Object.keys(json).reverse().reduce<string[]>((acc, key) => {
    const value = json[key]
    const prop = key.startsWith(`--`) ? key : `--` + key
    acc.push(`  ${prop}: ${value}`)
    return acc
  }, []).join('\n')
}