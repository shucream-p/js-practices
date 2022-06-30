const MemoController = require('../lib/memoController')
const options = require('minimist')(process.argv.slice(2))

function main () {
  const memoController = new MemoController()

  if (options.l) {
    memoController.index()
  } else if (options.r) {
    memoController.show()
  } else if (options.d) {
    memoController.destroy()
  } else {
    memoController.create()
  }
}

main()
