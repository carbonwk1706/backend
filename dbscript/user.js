const mongoose = require('mongoose')
const User = require('../model/User')
mongoose.connect('mongodb://localhost:27017/example')

async function main () {
  const users = new User({ name: 'test', username: 'admin' })
  users.save()
}

main().then(function () {
  console.log('Finish')
})
