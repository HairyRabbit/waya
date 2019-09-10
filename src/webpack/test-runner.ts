import * as memfs from 'memfs'
import * as fs from 'fs'
import * as path from 'path'
import * as webpack from 'webpack'

const DEFAULT_CONTEXT = '/'

interface RunnerRunResult {
  main: string
  assets: webpack.Stats.ToJsonOutput['assets']
  output: string
}

interface RunnerOptions {
  context: string
  disableIFS: boolean
}

export class Runner {
  compiler!: any
  ifs: typeof memfs.vol
  ofs: typeof memfs.vol

  constructor(public options: Partial<Readonly<RunnerOptions>> = {}) {
    this.ifs = memfs.Volume.fromJSON({})
    this.ofs = memfs.Volume.fromJSON({})
  }

  addFile(filePath: string, content: string = '') {
    if(this.options.disableIFS) throw new Error(`Can't work with fakeIFS`)
    const fpath = path.posix.resolve(DEFAULT_CONTEXT, filePath)
    const dirname = path.posix.dirname(fpath)
    this.ifs.mkdirpSync(dirname)
    this.ifs.writeFileSync(fpath, content)
    return this
  }

  addFileFrom(filePath: string) {
    if(this.options.disableIFS) throw new Error(`Can't work with fakeIFS`)
    if(!path.isAbsolute(filePath)) throw new Error('Argument filePath should be absolute path')
    const content = fs.readFileSync(filePath, 'utf-8')
    const mountPath = normalizePath(filePath.replace(this.options.context || '', ''))
    return this.addFile(mountPath, content)
  }

  getOutputFile(filepath: string) {
    const fpath = path.posix.resolve(DEFAULT_CONTEXT, filepath)
    return this.ofs.readFileSync(fpath, 'utf-8')
  }

  inspectIFS() {
    if(this.options.disableIFS) throw new Error(`Can't work with fakeIFS`)
    console.log(this.ifs.toJSON())
    return this
  }

  run(options: webpack.Configuration = {}): Promise<RunnerRunResult> {
    options.context = DEFAULT_CONTEXT
    options.mode = 'none'
    options.output = {
      ...options.output,
      publicPath: DEFAULT_CONTEXT,
      path: DEFAULT_CONTEXT
    }
    options.optimization = {
      noEmitOnErrors: true,
      namedModules: true,
      namedChunks: true,
      providedExports: true,
      usedExports: true
    }
    options.plugins = options.plugins || []
    const compiler = this.compiler = webpack(options)
    if(!this.options.disableIFS) compiler.inputFileSystem = this.ifs as any
    compiler.outputFileSystem = this.ofs as any
    compiler.outputFileSystem.join = path.posix.join.bind(path.posix)
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if(err) return reject(err)
        const json = stats.toJson()

        console.log(stats.toString({ colors: true }))

        if(stats.hasErrors()) {
          console.log(json.errors)
          return reject(json.errors)
        }

        resolve({
          main: this.getResult(),
          assets: json.assets,
          output: '\n\n' + stats.toString() + '\n'
        })
      })
    })
  }
  getResult() {
    const output = this.getOutputFile('./main.js').toString()
          .replace(/\/\*{6}\/(.*)/g, '')
          .trim()
    return '{' + output + '}'
  }
}

function normalizePath(filePath: string): string {
  if(!path.isAbsolute(filePath)) throw new Error('Argument filePath should be absolute path')
  return filePath.replace(/\\/g, '\/').replace(/(\w):/, (_, a: string) => a.toLowerCase() + ':')
}

export default function createRunner(options: Partial<Readonly<RunnerOptions>>): Runner {
  return new Runner(options)
}