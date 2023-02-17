const mongoose = require('mongoose')
const Receipt = require('../models/Receipt')
const User = require('../models/User')
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/Project_intern', { useNewUrlParser: true })
async function clearReceipt () {
  await Receipt.deleteMany({})
}

async function main () {
  await clearReceipt()
  const receipt = new Receipt({
    user: '63e9acd3f214444dc15e8c0e',
    request: 'คำร้องขอเติม Coin',
    status: 'pending',
    username: 'wuttiwat',
    amount: 50,
    method: 'ธนาคารกรุงเทพ จำกัด (มหาชน)'
  })
  const id = '63e9acd3f214444dc15e8c0e'
  const user = await User.findById(id).exec()
  user.receiptHistory.push(receipt)
  await receipt.save()
  await user.save()
  // await users.requestHistory.push(request)
}

main().then(() => {
  console.log('Finish')
})
