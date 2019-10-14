import * as fs from 'fs'
import * as path from 'path'
import { safeLoad } from 'js-yaml'
import { isFileExists } from './fs-util'
import { Json, assertJsonObjectType, assertJsonStringType, assertJsonBooleanType, ensureJsonObjectType } from './json-util'
import * as createDebugger from 'debug'

const debug = createDebugger('project-config')

export const CONFIG_NAME: string = '.waya'

interface ProjectConfig {
  lang: string
  locales: string
  router: {
    async: boolean
  }
}

const DEFAULT_CONFIG: ProjectConfig = {
  lang: 'en',
  locales: 'locales',
  router: {
    async: false
  }
}

export default function resolveConfig(context: string): ProjectConfig {
  const configPath = path.join(context, CONFIG_NAME)
  debug('path', configPath)
  if(!isFileExists(configPath)) return DEFAULT_CONFIG
  const configContent = fs.readFileSync(configPath, 'utf-8')
  const config: Json = safeLoad(configContent)
  debug('content', config)
  const normalized = normalizeConfig(config, DEFAULT_CONFIG)
  debug('normalize', normalized)
  return normalized
}

function normalizeConfig(config: Json, defaultConfig: ProjectConfig): ProjectConfig {
  assertJsonObjectType(config)
  const acc: ProjectConfig = Object.create(null)
  acc.lang = getValueOrElse(assertJsonStringType, config.lang, defaultConfig.lang)
  acc.locales = getValueOrElse(assertJsonStringType, config.locales, defaultConfig.locales)

  const router: ProjectConfig['router'] = Object.create(null)
  const configRouter = ensureJsonObjectType(config.router, Object.create(null))
  router.async = getValueOrElse(assertJsonBooleanType, configRouter.async, defaultConfig.router.async)
  acc.router = router

  return acc
}

function getValueOrElse<T extends Json>(asserter: (value: Json) => asserts value is T, value: Json | undefined, defaultValue: T): T {
  if(undefined === value) return defaultValue
  asserter(value)
  return value
}