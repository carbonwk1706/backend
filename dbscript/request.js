const mongoose = require('mongoose')
const Request = require('../models/Request')
const User = require('../models/User')
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/Project_intern', { useNewUrlParser: true })
async function clearRequest () {
  await Request.deleteMany({})
}

async function main () {
  await clearRequest()
  const request = new Request({
    user: '63e984f7a31a219cb1c3e779',
    request: 'คำร้องขอสมัครขายอีบุ๊ค',
    status: 'pending',
    publisher: 'กัปตัน',
    firstName: 'Wuttiwat',
    lastName: 'Phoemsirikawinkun',
    idCard: '1234567891236',
    phone: '1234567892',
    address: '302/52',
    road: 'ลาดพร้าวซอย 1',
    subDistrict: 'จอมพล',
    district: 'จตุจักร',
    province: 'กรุงเทพ',
    postCode: '10900',
    bankAccount: '1234569871',
    idAccount: '1234567895'
  })
  const id = '63e984f7a31a219cb1c3e779'
  const user = await User.findById(id).exec()
  user.requestHistory.push(request)
  await request.save()
  await user.save()
  // await users.requestHistory.push(request)
}

main().then(() => {
  console.log('Finish')
})
