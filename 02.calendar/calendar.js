const today = new Date()
const year = today.getFullYear()
const month = today.getMonth() + 1
const firstWday = new Date(year, month - 1, 1).getDay()
const lastDay = new Date(year, month, 0).getDate()

console.log(`      ${month}月 ${year}`)
console.log('日 月 火 水 木 金 土')
for (let cnt = 1; cnt <= firstWday; cnt++) {
  process.stdout.write('   ')
}
for (let day = 1; day <= lastDay; day++) {
  const date = new Date(year, month - 1, day)
  process.stdout.write(date.getDate().toString().padStart(2))
  process.stdout.write(' ')
  if (date.getDay() === 6) {
    process.stdout.write('\n')
  }
}
