import chalk from 'chalk'

export const TITLE: string = 'waya'

function log<T>(message: T): T
function log(...message: any[]): void
function log(...message: any[]) {
  console.log.apply(console, [chalk.yellowBright(TITLE), ...message])
  if(message.length === 1) return message[0]
}

export default log