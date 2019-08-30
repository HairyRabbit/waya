import createService from './service'
import * as services from './services'

const service = createService()
for (const mod in services) {
  if (services.hasOwnProperty(mod)) {
    const ServiceConstructor = services[mod as keyof typeof services]
    const handlers = new ServiceConstructor(service).exports
    for (const name in handlers) {
      if (handlers.hasOwnProperty(name)) {
        const handle = handlers[name as keyof typeof handlers]
        service.addService(`${mod}/${name}`, handle)
      }
    }
  }
}
service.initial()

export default async function main() {
  const port = await service.start()
  console.info(`Service listen on port ${port}`)
  service.client.request(`webpack/start`, [], () => {})
}

export async function build() {
  const port = await service.start()
  console.info(`Service listen on port ${port}`)
  service.client.request(`webpack/build`, [], () => {})
}