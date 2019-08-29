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

export const enum ServiceStatus {
  None, Initial, Start
}

export class Service {
  ws!: WebSocket.Server
  server!: jayson.Server
  client!: jayson.Client
  config!: ConfigService
  status: ServiceStatus = ServiceStatus.None
  private services: Map<string, jayson.MethodLike> = new Map

  initial() {
    this
      .addService(`service/list`, this.list.bind(this))
      .addService(`service/status`, this.showStatus.bind(this))

    const services = Object.create(null)
    this.services.forEach((service, key) => {
      services[key] = service
    })

    this.server = new jayson.Server(services)
    this.client = new jayson.Client(this.server)
    this.ws = new WebSocket.Server({ server: this.server.http() })
    this.config = new ConfigService(this)
    this.status++
    return this
  }

  addService(name: string, method: jayson.MethodLike) {
    this.services.set(name, method)
    return this
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

  async start(): Promise<number> {
    if(this.status === ServiceStatus.None) this.initial()

    return new Promise(resolve => {
      this.config.read([], (error: any, data?: any) => {
        if(error) return
        this.server.http().listen(data.port, data.host, () => {
          this.status++
          resolve(data.port)
        })
      })
    })
  }

  list(_args: never, callback: ServiceCallback<string[]>) {
    const services: string[] = []
    this.services.forEach((_, key) => {
      services.push(key)
    })
    callback(null, services)
  }

  showStatus(_args: never, callback: ServiceCallback<ServiceStatus>) {
    callback(null, this.status)
  }
}

export default function createService(): Service {
  return new Service()
}