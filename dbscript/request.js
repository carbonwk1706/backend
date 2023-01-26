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
    request: 'I would like to request a new feature',
    status: 'pending'
  })

  await request.save()
}

main().then(() => {
  console.log('Finish')
})