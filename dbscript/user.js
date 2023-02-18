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
  const users = new User({ name: 'Wuttiwat Phoemsirikawinkun', username: 'wuttiwat', email: 'user@mail.com', coin: 500, gender: 'Male', password: 'password', roles: [ROLE.USER] })
  await users.save()
  const localAdmin = new User({ name: 'LocalAdmin', username: 'localadmin', password: 'password', email: 'localadmin@mail.com', coin: 500, gender: 'Female', roles: [ROLE.LOCAL_ADMIN, ROLE.USER] })
  await localAdmin.save()
  const admin = new User({ name: 'Admin', username: 'admin', password: 'password', email: 'admin@mail.com', coin: 500, gender: 'Female', roles: [ROLE.ADMIN, ROLE.USER] })
  await admin.save()
}

main().then(() => {
  console.log('Finish')
})
