const mongoose = require('mongoose')
const Request = require('../models/Request')
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/Project_intern', { useNewUrlParser: true })
async function clearRequest () {
  await Request.deleteMany({})
}

async function main () {
  await clearRequest()
  const request = new Request({
    user: '63d0618ec6891a5004608c81',
    request: 'ROLE.[SELL]',
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

  await request.save()
}

main().then(() => {
  console.log('Finish')
})
