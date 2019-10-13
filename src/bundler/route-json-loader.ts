import * as path from 'path'
import * as webpack from 'webpack'
import * as createDebugger from 'debug'
import { stringifyRequest, getOptions } from 'loader-utils'

const debug = createDebugger('route-json-loader')

type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[]

type RouteConfig = {
  path: string
  component: string
  exact: boolean
}

declare module 'webpack' {
  namespace loader {
    interface LoaderContext {
      getResolve(options: { mainFiles?: string[], extensions?: string[] }): (context: string, request: string) => Promise<string>
    }
  }
}

export default async function load(this: webpack.loader.LoaderContext, data: string) {
  this.cacheable && this.cacheable(true)
  const done = this.async()
  const { component } = getOptions(this)
  const resolve = this.getResolve({ mainFiles: ['route'] })

  const json: Json = JSON.parse(data)
  const relativeContext = path.relative(this.rootContext, this.context)

  const { context, async, routes } = normalizeJson(json, { context: normalizeContext(relativeContext), async: false })
  
  const routesInjects: string[] = []
  for(let i = 0; i < routes.length; i++) {
    const route = routes[i]
    const moduleRequest = await resolve(path.resolve(this.context, route.component), '.')
    this.addDependency(moduleRequest)
    const routeModule = stringifyRequest(this, moduleRequest)
    const routePath = (context + route.path).replace(/^\/\//, '/')
    const routeName = context.replace(/^\/+/, '').replace(/\//g, '-')

    const inject = '{' + 
      `exact: ${JSON.stringify(route.exact)}, ` +
      `path: ${JSON.stringify(routePath)}, ` +
      (!async 
          ? `component: require(${routeModule}).default`
          : `component: import(/* webpackMode: "eager", webpackChunkName: "${routeName}" */${routeModule})`) +
    '}'
    routesInjects.push(inject)
  }

  debug(routesInjects)

  const content = '' +
  `import { RouteContainer } from '${component.replace(/\\/g, '\\\\')}'\n` +
  '\n' + 
  'const routes = [\n' + 
  routesInjects.join(',\n') + '\n' + 
  ']\n' + 
  `const async = ${JSON.stringify(async)}\n` +
  '\n' + 
  'export default function PageRoute({ ...props }) {\n' + 
  '  return <RouteContainer async={async} routes={routes} {...props} />\n' + 
  '}\n' + 
  '\n' +
  `PageRoute.displayName = 'PageRoute(${context})'`

  done!(null, content)
}

function normalizeContext(relative: string): string {
  return '/' + relative.split(path.sep).map(p => p.toLowerCase()).join('/')
}

function normalizeJson(json: Json, defaults: { context: string, async: boolean }): { context: string, routes: RouteConfig[], async: boolean } {
  assertJsonObjectType(json)
  if(!json.routes) return { ...defaults, routes: normalizeRoutesJson(json) }
  return { 
    context: getDefaultValue(assertJsonStringType, json.context, defaults.context),
    async: getDefaultValue(assertJsonBooleanType, json.async, defaults.async),
    routes: normalizeRoutesJson(json.routes)
  }
}

function normalizeRoutesJson(routes: Json): RouteConfig[] {
  assertJsonObjectType(routes)
  const acc = []
  for (const key in routes) {
    if (routes.hasOwnProperty(key)) {
      const val = routes[key]
      const defaultExact = key.endsWith('/')
      if('string' === typeof val) {
        acc.push({ 
          path: key, 
          component: val, 
          exact: defaultExact 
        })
      } else {
        assertJsonObjectType(val)
        const { component } = val
        assertJsonStringType(component)
        acc.push({ 
          path: key, 
          component, 
          exact: getDefaultValue(assertJsonBooleanType, val.exact, defaultExact) 
        })
      }
    }
  }
  return acc
}

// function assertJsonArrayType(json: Json): asserts json is { [property: string]: Json } {
//   if(!Array.isArray(json)) throw new Error(`Json not array`)
// }

function assertJsonObjectType(json: Json): asserts json is { [property: string]: Json } {
  if('object' === typeof json && !Array.isArray(json)) return 
  throw new Error(`Json not object`)
}

function assertJsonStringType(data: Json): asserts data is string {
  if('string' === typeof data) return
  throw new Error(`Json not string`)
}

function assertJsonBooleanType(data: Json): asserts data is boolean {
  if('boolean' !== typeof data) return
  throw new Error(`Json not boolean`)
}

function getDefaultValue<T extends string | boolean>(asserter: (json: Json) => asserts json is T, data: Json, defaults: T): T {
  if(null === data || undefined === data) return defaults
  asserter(data)
  return data
}
