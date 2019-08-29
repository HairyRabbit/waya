import { Service, ServiceCallback } from '../service'

export default class PingService {
  constructor(_service: Service) {}
  ping(_args: string[], callback: ServiceCallback<string>) {
    callback(null, 'pong')
  }

  exports = {
    ping: this.ping.bind(this)
  }
}