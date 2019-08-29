import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { Service, ServiceCallback } from '../service'

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

export default class ConfigService {
  constructor(_service: Service) {}
  read(_args: string[], callback: ServiceCallback<Config>): void {
    if(!fs.existsSync(CONFIG_FILEPATH)) return callback(null, DEFAULT_CONFIG)
    const config = normalizeConfig(JSON.parse(fs.readFileSync(CONFIG_FILENAME, 'utf-8')))
    callback(null, config)
  }

  write(config: Config): void {
    fs.writeFileSync(CONFIG_FILENAME, JSON.stringify(config), 'utf-8')
  }

  exports = {
    read: this.read.bind(this),
    write: this.write.bind(this)
  }
}

function normalizeConfig(data: any): Config {
  return {
    port: data.port || DEFAULT_CONFIG.port,
    host: data.host || DEFAULT_CONFIG.host
  }
}