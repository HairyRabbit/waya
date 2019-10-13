// import * as fs from 'fs'
// import * as path from 'path'

// type Json =
//   | string
//   | number
//   | boolean
//   | null
//   | { [property: string]: Json }
//   | Json[]

// enum RouteNodeKind {
//   String,
//   Routes,
//   ContextRoutes
// }

// interface RouteBaseNode {
//   context: string
//   root: string
// }

// interface RouteStringNode extends RouteBaseNode {
//   kind: RouteNodeKind
//   value: string
// }

// interface RouteRoutesNode extends RouteBaseNode {
//   kind: RouteNodeKind.Routes
//   value: Map<string, RouteNode>
// }

// type RouteNode =
//   | RouteRoutesNode
//   | RouteStringNode


// function createRouteNode(json: Json, root: string): RouteRoutesNode {
//   // const node = Object.create(null)
//   if(!isObjectJson(json)) throw new Error('not vaild root route')
//   return createRouteRoutesNode(json, root, root)
// }

// function createRouteRoutesNode(json: { [k:string]: Json }, context: string, root: string): RouteRoutesNode {
//   const kind = RouteNodeKind.Routes
//   const value = new Map
//   for (const key in json) {
//     if (json.hasOwnProperty(key)) {
//       const val = json[key]
//       if('string' === typeof val) {
//         value.set(key, createRouteStringNode(val))
//       } else if(isObjectJson(val)) {
//         const currentContext = path.join(context, key)
//         value.set(key, createRouteRoutesNode(val, currentContext, root ))
//       } else {
//         throw new Error(`not valid route routes type`)
//       }
//     }
//   }
//   return { kind, value, context, root }
// }

// function createRouteStringNode(value: string) {

// }

// // type RouteConfig = { [path: string]: string | RouteNode }
// // type RouteNormalizedConfig = { name: string, route: RouteConfig }
// // type RouteNodeRoutes = { [path: string]: RouteNode }
// // type RouteNode = 
// //   | string 
// //   | RouteNodeRoutes
// //   | { name: string, route: RouteNodeRoutes }

// function scan(root: string, name: string = 'page', config: string = 'route.json') {
//   const root = {}
//   function recur(context: string) {
//     const pagePath = path.join(context, name)
//     if(!isDirectory(pagePath)) return
//     const configPath = path.join(pagePath, config)
//     if(!isFile(configPath)) return
    
//     const nodes = parseConfig(configPath)

//   }
// }

// function parse() {

// }

// function parseConfig(filePath: string, context: string, root: string): RouteNormalizedConfig {
//   try {
//     const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
//     if(!isObjectJson(json)) throw new Error('not vaild route config')
//     return normalizeRouteNode(json, context, context)
//   } catch(e) {
//     throw new Error(`JSON parse error ${filePath}`)
//   }
// }

// function normalizeRouteNode(json: { [property: string]: Json }, context: string, root: string): RouteNode {
//   if(json.name) {
//     const { name, route } = json
//     if('string' !== name) throw new TypeError('not valid route name')
//     if(!isObjectJson(route)) throw new TypeError(`not vaild route routes`)
//     assertRouteConfigRoutes(route)
//     return { name, route }
//   } else {
//     assertRouteConfigRoutes(json)
//     return { name: context, route: json }
//   }
// }

// function normalizeRouteNodeRoutes(json: { [property: string]: string }, context: string, root: string): RouteNodeRoutes {

// }

// function isObjectJson(json: Json): json is { [property: string]: Json } {
//   return 'object' === typeof json && !Array.isArray(json)
// }

// function assertRouteConfigRoutes(json: { [property: string]: Json }): asserts json is { [path: string]: string }  {
//   for (const property in json) {
//     if (json.hasOwnProperty(property)) {
//       const value = json[property]
//       switch(typeof value) {
//         case 'string': break
//         case 'object': {
//           normalizeRouteNode(value)
//           break
//         }
//         default: throw new TypeError('route value not string')
//       }
//     }
//   }
// }

// function parseRouteDefine() {

// }