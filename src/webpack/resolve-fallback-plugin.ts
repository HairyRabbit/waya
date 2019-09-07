import * as webpack from 'webpack'
// import * as fs from 'fs'

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
  private name: string = this.constructor.name
  private matcher!: string[]

  constructor(public target: string, public fallback: string | string[]) {}

  fileExists(compiler: webpack.Compiler, filePath: string): boolean {
    const fs = compiler.inputFileSystem
    this.matcher.forEach(filePath => {
      fs._statStorage.data.delete(filePath)
    })
    try {
      return fs.statSync(filePath).isFile()
    } catch(_e) { return false }
    // console.log(filePath)
    // return fs.existsSync(filePath)
  }

  getExistsResource(compiler: webpack.Compiler): string {
    const resource = this.matcher.slice(1).find(filePath => this.fileExists(compiler, filePath))
    if(undefined === resource) throw new Error(`All resources not exists`)
    return resource
  }

  apply(compiler: webpack.Compiler) {
    this.matcher = [
      this.target,
      this.target.replace(compiler.context, '@').replace(/\\/g, '\/'),
      ...Array.isArray(this.fallback) ? this.fallback : [ this.fallback ]
    ]

    console.debug(this.name, this.matcher)

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
        const [ resource, ...loaders ] = request.request.split('!').reverse()
        if(!this.matcher.includes(resource)) return
        console.debug(this.name, request.request)
        const loadersRequest = loaders.reverse().join('!')

        if(this.fileExists(compiler, this.target)) return { 
          ...request,
          request: [loadersRequest, this.target].join('!')
        } 
        else return { 
          ...request,
          request: [loadersRequest, this.getExistsResource(compiler)].join('!')
        }
      })
    })
  }
}