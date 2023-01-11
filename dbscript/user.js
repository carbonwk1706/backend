const mongoose = require('mongoose')
const User = require('../models/User')
const { ROLE } = require('../constant')
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/Project_intern', { useNewUrlParser: true })
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

main().then(() => {
  console.log('Finish')
})
