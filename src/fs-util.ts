import * as fs from 'fs'

function isExists(filter: (stat: fs.Stats) => boolean) {
  return function isExists1(source: string): boolean {
    try {
      const stat = fs.statSync(source)
      return filter(stat)
    } catch(e) {
      return false
    }
  }
}

export const isFileExists = isExists(stat => stat.isFile())
export const isDirectoryExists = isExists(stat => stat.isDirectory())