import * as webpack from 'webpack'
import * as path from 'path'
import * as createDebugger from 'debug'
// import * as fs from 'fs'

const debug = createDebugger('resolve-fallback-plugin')

declare module 'webpack' {
  namespace compilation {
    interface Module {
      resource: string
      buildInfo: {
        cacheable: boolean
      }
    }
  }

  interface InputFileSystem {
    _statStorage: {
      data: Map<string, [Error | null, any]>
    }
  }
}

export default class ResolveFallbackPlugin implements webpack.Plugin {
  public fallback: string[]
  private name: string = this.constructor.name
  private matcher!: string[]

  constructor(public target: string, fallback: string | string[]) {
    this.fallback = Array.isArray(fallback) ? fallback : [fallback]
  }

  fileExists(compiler: webpack.Compiler, filePath: string): boolean {
    const fs = compiler.inputFileSystem
    const files = [this.target, ...this.fallback]
    files.forEach(filePath => fs._statStorage.data.delete(filePath))
    try {
      return fs.statSync(filePath).isFile()
    } catch(_e) { return false }
    // console.log(filePath)
    // return fs.existsSync(filePath)
  }

  getExistsResource(compiler: webpack.Compiler): string {
    const resource = this.fallback.find(filePath => this.fileExists(compiler, filePath))
    if(undefined === resource) throw new Error(`All resources not exists`)
    return resource
  }

  trimExtension(filePath: string): string {
    const ext = path.extname(filePath)
    return filePath.replace(ext, '')
  }

  apply(compiler: webpack.Compiler) {
    const alias = this.target.replace(compiler.context, '@').replace(/\\/g, '\/')
    this.matcher = [
      this.target,
      alias,
      this.trimExtension(this.target),
      this.trimExtension(alias),
      ...Array.isArray(this.fallback) ? this.fallback : [ this.fallback ]
    ]

    // console.debug(this.name, this.matcher)

    compiler.hooks.compilation.tap(this.name, compilation => {
      compilation.hooks.succeedModule.tap(this.name, normalModule => {
        const isMatch = this.matcher.includes(normalModule.resource)
        if(!isMatch) return
        normalModule.buildInfo.cacheable = false
        return
      })
    })

    compiler.hooks.normalModuleFactory.tap(this.name, normalModuleFactory => {
      normalModuleFactory.hooks.beforeResolve.tap(this.name, request => {
        // const [ resource, ...loaders ] = request.request.split('!').reverse()
        const matched = this.matcher.find(filePath => request.request.endsWith(filePath))
        if(undefined === matched) return
        // const loadersRequest = loaders.reverse().join('!')
        debug(this.name, request.request)
        const loaders = request.request.replace(matched, '')
        
        if(this.fileExists(compiler, this.target)) { 
          // console.log(42, this.target, request,  [loadersRequest, this.target].join('!'))
          // return
          // request.context = compiler.context
          request.request = loaders + this.target //[loadersRequest, this.target].join('!')
        } else { 
          // console.log(43, this.target, request,  [loadersRequest, this.getExistsResource(compiler)].join('!'))
          // request.request = [loadersRequest, this.getExistsResource(compiler)].join('!')
          request.request = loaders + this.getExistsResource(compiler)
        }

        return request
      })
    })
  }
}