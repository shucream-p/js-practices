const Storage = require('./storage')

module.exports = class MemoController {
  constructor () {
    this.storage = new Storage()
  }

  async create () {
    const texts = await this.getStdin()
    this.storage.create(texts)
  }

  async index () {
    try {
      const memos = await this.storage.read()

      if (memos.length === 0) {
        throw new Error('メモがありません')
      }
      const titles = memos.map(({ content }) => content.split('\n')[0])
      titles.forEach(title => console.log(title))
    } catch (e) {
      console.log(e)
    }
  }

  async show () {
    try {
      const memos = await this.storage.read()

      if (memos.length === 0) {
        throw new Error('メモがありません')
      }
      const titles = memos.map(({ content }) => content.split('\n')[0])
      const prompt = await this.generatePrompt('see', titles)
      const answer = await prompt.run()
      const memo = memos.find(({ content }) => content.split('\n')[0] === answer)
      console.log(memo.content)
    } catch (e) {
      console.log(e)
    }
  }

  async destroy () {
    try {
      const memos = await this.storage.read()

      if (memos.length === 0) {
        throw new Error('メモがありません')
      }
      const titles = memos.map(({ content }) => content.split('\n')[0])
      const prompt = await this.generatePrompt('delete', titles)
      const answer = await prompt.run()
      const memo = memos.find(({ content }) => content.split('\n')[0] === answer)
      this.storage.delete(memo.id)
    } catch (e) {
      console.log(e)
    }
  }

  getStdin () {
    return new Promise(resolve => {
      process.stdin.setEncoding('utf8')
      const lines = []
      const rl = require('readline').createInterface({
        input: process.stdin
      })

      rl.on('line', line => lines.push(line))
      rl.on('close', () => resolve(lines))
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
