// import * as webpack from 'webpack'
// import * as WebpackDevServer from 'webpack-dev-server'
// import * as express from 'express'
// import * as bodyParser from 'body-parser'
import * as os from 'os'
import * as fs from 'fs'
import * as path from 'path'
import * as jayson from 'jayson'
import * as WebSocket from 'ws'
import ConfigService from './services/config'

export interface ServiceError<T = {}> {
  code: number
  message: string
  data?: T
}

export interface ServiceCallback<T = void, E = {}> {
  (error: null, data: T): void
  (error: ServiceError<E>): void
}


const CONFIG_FILENAME: string = 'webin.json'
const CONFIG_FILEPATH: string = path.join(os.homedir(), CONFIG_FILENAME)

interface Config {
  port: number
  host: string
}

const DEFAULT_CONFIG: Config = {
  port: 1973,
  host: '0.0.0.0'
}

function normalizeConfig(data: any): Config {
  return {
    port: data.port || DEFAULT_CONFIG.port,
    host: data.host || DEFAULT_CONFIG.host
  }
}

export class Service {
  ws!: WebSocket.Server
  server!: jayson.Server
  client!: jayson.Client
  config!: ConfigService
  init: boolean = false
  private services: Map<string, jayson.MethodLike> = new Map

  initial() {
    console.log(this)
    this.addService(`services/list`, this.listService.bind(this))
    const services = Object.create(null)
    this.services.forEach((service, key) => {
      services[key] = service
    })
    this.server = new jayson.Server(services)
    this.client = new jayson.Client(this.server)
    this.ws = new WebSocket.Server({ server: this.server.http() })
    this.config = new ConfigService(this)
    this.init = true
    return this
  }

  addService(name: string, method: jayson.MethodLike) {
    this.services.set(name, method)
  }

  call<T>(method: string, params: jayson.RequestParamsLike = []) {
    return new Promise<T>((resolve, reject) => {
      const callback = (err: any, res: T) => {
        if(err) return reject(err)
        resolve(res)
      }
      this.client.request(method, params, callback)
    })
  }

  readConfig(): Config {
    if(fs.existsSync(CONFIG_FILEPATH)) return normalizeConfig(JSON.parse(fs.readFileSync(CONFIG_FILENAME, 'utf-8')))
    return DEFAULT_CONFIG
  }

  writeConfig(config: Config): void {
    fs.writeFileSync(CONFIG_FILENAME, JSON.stringify(config), 'utf-8')
  }

  listService(_args: [], callback: ServiceCallback<string[]>) {
    const services: string[] = []
    this.services.forEach((_, key) => {
      services.push(key)
    })
    callback(null, services)
  }

  async startServer() {
    if(!this.init) this.initial()
    this.config.read([], (error: any, data?: any) => {
      if(error) return
      this.server.http().listen(data.port, data.host)
    })
  }
}


// const RPCENDPOINT = '/__SERVICE__'

// class Service {
//   compiler: webpack.Compiler | null = null
//   server: WebpackDevServer | null = null
//   jsonrpcServer: jayson.Server | null = null
//   jsonrpcClient: jayson.Client | null = null
//   app: express.Application = express()

//   init() {
//     this.app.listen(8081)
//     return this
//   }

//   configServer(): this {
//     this.compiler = webpack({})
//     this.server = new WebpackDevServer(this.compiler, {
//       after: this.configJSONRPCServer.bind(this)
//     })
//     return this
//   }

//   clean() {
//     this.compiler = null
//     this.server = null
//     this.jsonrpcServer = null
//     this.jsonrpcClient = null
//   }

//   configJSONRPCServer(app: express.Application) {
//     this.jsonrpcServer = new jayson.Server({
//       ping: (_args: string[], cb: Function) => {
//         cb(null, 'pong')
//       },

//       startServer: async (_args: string, cb: Function) => {
//         console.log(`Server will start or restart`)
//         cb(null, 'Server will start or restart')
//         await this.startServer()
//       },

//       showStatus: (_args: string, cb: Function) => {
//         cb(null, this.showStats())
//       }
//     })

//     this.jsonrpcClient = new jayson.Client(this.jsonrpcServer)

//     this.app.use(bodyParser.json())
//     this.app.use(RPCENDPOINT, this.jsonrpcServer.middleware() as any)
//     this.app.use(app)
//   }

//   async startServer(): Promise<void> {
//     if(null !== this.server) {
//       await this.stopServer()
//     }

//     this.configServer()

//     return new Promise((resolve, reject) => {
//       this.server!.listen(8080, '', err => {
//         if(err) return reject(err)
//         resolve()
//       })
//     })
//   }

//   async stopServer(): Promise<void> {
//     if(null === this.server) return
//     return new Promise(resolve => {
//       this.server!.close(() => {
//         this.clean()
//         resolve()
//       })
//     })
//   }

//   async restartServer(): Promise<void> {
//     return await this.startServer()
//   }

//   showStats() {
//     return this.compiler
//   }
// }

export default function createService(): Service {
  return new Service()
}