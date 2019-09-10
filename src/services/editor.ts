import { Service, ServiceCallback } from '../service'
import * as which from 'which'
import { execFileSync } from 'child_process'

export const enum ErrorCode {
  EditorUnsearched = 50001
}

type OpenEditorArgument = [ string, string? ]

export default class Editor {
  constructor(_service: Service) {}

  openEditor(filePath: string) {
    try {
      const vscode = which.sync('code')
      execFileSync(vscode, [ filePath ])
    } catch(e) {
      throw {
        code: ErrorCode.EditorUnsearched,
        message: e.message,
        data: e
      }
    }
  }

  openEditorProcess(args: OpenEditorArgument, callback: ServiceCallback<string>) {
    try {
      const vscode = which.sync('code')
      const out = execFileSync(vscode, [ args[0] ])
      callback(null, out.toString())
    } catch(e) {
      callback({
        code: ErrorCode.EditorUnsearched,
        message: e.message,
        data: e
      })
    }
  }

  exports = {
    openEditor: this.openEditorProcess.bind(this)
  }
}