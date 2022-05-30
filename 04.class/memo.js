process.stdin.setEncoding('utf8')

const lines = []
const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (line) => {
  lines.push(line)
})
rl.on('close', () => {
  console.log(lines)
})
