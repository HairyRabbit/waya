import * as fs from 'fs'
import * as path from 'path'
import * as normalizeData from 'normalize-package-data'

export default function resolvePackage(context: string): normalizeData.Package {
  const packagePath = path.resolve(context, 'package.json')
  const isExists = fs.existsSync(packagePath)
  const data = isExists 
    ? JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
    : { name: path.basename(context) }
  normalizeData(data, true)
  return data
}