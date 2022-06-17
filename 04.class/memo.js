const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('memo.sqlite')
const options = require('minimist')(process.argv.slice(2))

function getMemoTitles () {
  return new Promise(resolve => {
    const memoTitles = []
    db.all('SELECT title FROM memos', (err, rows) => {
      if (err) {
        console.error(err.message)
      }
      rows.forEach(row => {
        memoTitles.push(row.title)
      })
      resolve(memoTitles)
    })
  })
}

if (options.l) {
  (async () => {
    const memoTitles = await getMemoTitles()
    memoTitles.forEach(title => {
      console.log(title)
    })
    db.close()
  })()
} else if (options.r) {
  (async () => {
    const memoTitles = await getMemoTitles()
    const { Select } = require('enquirer')
    const prompt = new Select({
      name: 'title',
      message: 'Choose a note you want to see:',
      choices: memoTitles
    })
    const answer = await prompt.run()

    db.get(`SELECT content FROM memos WHERE title = '${answer}'`, (err, row) => {
      if (err) {
        console.error(err.message)
      }
      console.log(row.content)
    })
    db.close()
  })()
} else if (options.d) {
  (async () => {
    const memoTitles = await getMemoTitles()
    const { Select } = require('enquirer')
    const prompt = new Select({
      name: 'title',
      message: 'Choose a note you want to delete:',
      choices: memoTitles
    })
    const answer = await prompt.run()

    db.get(`DELETE FROM memos WHERE title = '${answer}'`, err => {
      if (err) {
        console.error(err.message)
      }
    })
    db.close()
  })()
} else {
  process.stdin.setEncoding('utf8')

  const lines = []
  const rl = require('readline').createInterface({
    input: process.stdin
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
}
