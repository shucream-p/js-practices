const options = require('minimist')(process.argv.slice(2))

class Storage {
  constructor () {
    this.sqlite3 = require('sqlite3').verbose()
    this.db = new this.sqlite3.Database('memo.sqlite')
  }

  create (texts) {
    // データベースにメモを保存
    this.db.serialize(() => {
      this.db.run('CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)')
      const content = texts.join('\n')
      const insertData = this.db.prepare('INSERT INTO memos VALUES (NULL, ?)')
      insertData.run(content)
      insertData.finalize()
    })
  }

  read () {
    // データベースからメモを読み込む
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
    // データベースからメモを削除
    this.db.run(`DELETE FROM memos WHERE id = '${id}'`, err => {
      if (err) {
        console.error(err.message)
      }
    })
  }
}

class MemoController {
  constructor () {
    this.storage = new Storage()
  }

  async create () {
    const texts = await this.getStdin()
    this.storage.create(texts)
  }

  async index () {
    const memos = await this.storage.read()
    const titles = memos.map(({ content }) => content.split('\n')[0])
    titles.forEach(title => {
      console.log(title)
    })
  }

  async show () {
    const memos = await this.storage.read()
    const titles = memos.map(({ content }) => content.split('\n')[0])
    const prompt = await this.generatePrompt('see', titles)
    const answer = await prompt.run()
    const memo = memos.find(({ content }) => content.split('\n')[0] === answer)
    console.log(memo.content)
  }

  async delete () {
    const memos = await this.storage.read()
    const titles = memos.map(({ content }) => content.split('\n')[0])
    const prompt = await this.generatePrompt('delete', titles)
    const answer = await prompt.run()
    const memo = memos.find(({ content }) => content.split('\n')[0] === answer)
    this.storage.delete(memo.id)
  }

  getStdin () {
    return new Promise(resolve => {
      process.stdin.setEncoding('utf8')
      const lines = []
      const rl = require('readline').createInterface({
        input: process.stdin
      })

      rl.on('line', (line) => {
        lines.push(line)
      })
      rl.on('close', () => {
        resolve(lines)
      })
    })
  }

  generatePrompt (message, titles) {
    return new Promise(resolve => {
      const { Select } = require('enquirer')
      const prompt = new Select({
        name: 'title',
        message: `Choose a note you want to ${message}:`,
        choices: titles
      })

      resolve(prompt)
    })
  }
}

function main () {
  const memoController = new MemoController()

  if (options.l) {
    // タイトル一覧を表示する処理
    memoController.index()
  } else if (options.r) {
    // タイトル一覧から選択してメモを参照する処理
    memoController.show()
  } else if (options.d) {
    // タイトル一覧から選択してメモを削除する処理
    memoController.delete()
  } else {
    // 標準入力を受け取って、メモを保存する処理
    memoController.create()
  }
}

main()
