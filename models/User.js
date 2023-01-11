const { ROLE } = require('../constant')
const mongoose = require('mongoose')
const { Schema } = mongoose
const userSchema = Schema({
  name: String,
  username: String,
  password: String,
  roles: {
    type: [String],
    default: [ROLE.USER]
  }
})

module.exports = mongoose.model('User', userSchema)
