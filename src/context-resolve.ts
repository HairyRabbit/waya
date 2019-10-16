import * as path from 'path'
import { isDirectoryExists } from './fs-util'

export const CONTEXT: string = path.join(__dirname)
export const MODULE_CONTEXT: string = isDirectoryExists(path.join(__dirname, 'node_modules')) 
  ? path.join(__dirname, 'node_modules')
  : path.join(__dirname, '..', 'node_modules')
  
export default function contextResolve(...args: string[]): string {
  return path.resolve.apply(path, [CONTEXT, ...args])
}
