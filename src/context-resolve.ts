import * as path from 'path'

export const CONTEXT: string = path.join(__dirname, '..')
export default function contextResolve(...args: string[]): string {
  return path.resolve.apply(path, [CONTEXT, ...args])
}