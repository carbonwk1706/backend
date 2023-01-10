const mongoose = require('mongoose')
const User = require('../model/User')
const { ROLE } = require('../constant')
mongoose.connect('mongodb://localhost:27017/example')
async function clearUser () {
  await User.deleteMany({})
}

async function main () {
  await clearUser()
  const users = new User({ name: 'Wuttiwat Phoemsirikawinkun', username: 'user', password: 'password', roles: [ROLE.USER] })
  users.save()
  const admin = new User({ name: 'Admin', username: 'admin', password: 'password', roles: [ROLE.ADMIN, ROLE.USER] })
  admin.save()
}

main().then(function () {
  console.log('Finish')
})
