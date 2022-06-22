module.exports = class Storage {
  constructor () {
    this.sqlite3 = require('sqlite3').verbose()
    this.db = new this.sqlite3.Database('memo.sqlite')
  }

  create (texts) {
    this.db.serialize(() => {
      this.db.run('CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)')
      const content = texts.join('\n')
      const insertData = this.db.prepare('INSERT INTO memos VALUES (NULL, ?)')
      insertData.run(content)
      insertData.finalize()
    })
  }

  read () {
    return new Promise(resolve => {
      const memos = []
      this.db.all('SELECT * FROM memos', (err, rows) => {
        if (err) {
          console.error(err.message)
        }
        rows.forEach(row => {
          memos.push(row)
        })
        resolve(memos)
      })
    })
  }

  delete (id) {
    this.db.run(`DELETE FROM memos WHERE id = '${id}'`, err => {
      if (err) {
        console.error(err.message)
      }
    })
  }
}
