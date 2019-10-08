import * as os from 'os'
import { spawn } from 'child_process'
import { __importDefault } from 'tslib'
import log from './log'
import { CONTEXT } from './context-resolve'

export default function lazyRequire(name: string) {
  if(isModuleExists(name)) return __importDefault(require(name))
  
  log(`Context: ${CONTEXT}`)
  log(`Install package "${name}"...`)

  const npm  = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'
  return new Promise((resolve, reject) => {
    const proc = spawn(npm, [
      'i', 
      '--no-package-lock',
      name + '@latest'
    ], { env: process.env, cwd: CONTEXT, stdio: 'inherit' })

    proc.stdout && proc.stdout.on('data', (data) => {
      process.stdout.write(data)
    })
    
    proc.stderr && proc.stderr.on('data', (data) => {
      process.stderr.write(data)
    })
    
    proc.on('close', code => {
      if(0 === code) {
        log(`Install package "${name}" successful`)
        resolve(__importDefault(require(name)))
      } else {
        log(`Install package "${name}" failed`)
        reject(code)
      }
    })
  })
}

function isModuleExists(name: string): boolean {
  try {
    require.resolve(name)
    return true
  } catch(e) {
    return false
  }
}

// function shouldUpdate(name: string, version: string): boolean {
//   try {
//     const modulePackage = require(name + '/package.json')
//     const ver = modulePackage.version
//     if(!ver) throw new Error(`Can not read version`)

//   } catch(e) {
//     console.error(e)
//     return false
//   }
// }