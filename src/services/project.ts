import * as fs from 'fs'
import { Service, ServiceCallback } from '../service'

const enum ErrorCode {
  FSError = 30001,
}

const enum FileType { 
  File, 
  Directory,
  BlockDevice, 
  CharacterDevice, 
  SymbolicLink, 
  FIFO, 
  Socket,
  Unknown
}

export default class Project {
  context: string = process.cwd()
  constructor(private service: Service) {}
  
  readdir(_args: any, callback: ServiceCallback<{ name: string, type: FileType }[]>) {
    fs.readdir(this.context, {
      encoding: 'utf-8',
      withFileTypes: true
    }, (err, result) => {
      if(err) return callback({
        code: ErrorCode.FSError,
        message: err.message,
        data: err
      })

      callback(null, result.map(dirent => {
        return {
          name: dirent.name,
          type: dirent.isFile() ? FileType.File
            : dirent.isDirectory() ? FileType.Directory
            : dirent.isBlockDevice() ? FileType.BlockDevice
            : dirent.isCharacterDevice() ? FileType.CharacterDevice
            : dirent.isSymbolicLink() ? FileType.SymbolicLink
            : dirent.isFIFO() ? FileType.FIFO
            : dirent.isSocket() ? FileType.Socket
            : FileType.Unknown
        }
      }))
    })
  }

  mkdir() {}
  rmrf() {}
  writeFile() {}
  readFile() {}
  unlink() {}

  start(_args: string[], callback: ServiceCallback) {
    this.service.client.request('webpack/startServer', { context: this.context }, (_err: any, response: any) => {
      if(response.error) return callback(response.error)
      callback(null)
    })
  }

  stop() {}
  build() {}
  deploy() {}

  exports = {
    readdir: this.readdir.bind(this),
    start: this.start.bind(this)
  }
}