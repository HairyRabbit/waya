import { spawn } from 'child_process'
import * as os from 'os'
import * as path from 'path'
import { __importDefault } from 'tslib'

const context = path.resolve(__dirname, '../')

export default function lazyRequire(name: string) {
  if(isModuleExists(name)) return __importDefault(require(name))
  
  console.log(`The package "${name}" not found, install...`)
  const npm  = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'
  return new Promise((resolve, reject) => {
    const pkger = spawn(npm, [
      'i', 
      '--no-package-lock',
      name + '@latest'
    ], { env: process.env, cwd: context, stdio: 'inherit' })

    pkger.stdout && pkger.stdout.on('data', (data) => {
      console.log(data)
    });
    
    pkger.stderr && pkger.stderr.on('data', (data) => {
      console.error(data)
    });
    
    pkger.on('close', code => {
      if(0 === code) {
        console.log(`Install package "${name}" successful`)
        resolve(__importDefault(require(name)))
      } else {
        console.log(`Install package "${name}" failed`)
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