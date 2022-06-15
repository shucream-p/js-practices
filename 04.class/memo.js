const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('memo.sqlite')

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
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS memos (title TEXT, content TEXT)')
    const title = lines[0]
    lines.shift()
    const content = lines.join('\n')
    const insertData = db.prepare('INSERT INTO memos VALUES (?, ?)')
    insertData.run(title, content)
    insertData.finalize()
  })
  db.close()
})
