const { ROLE } = require('../constant')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { Schema } = mongoose
const userSchema = Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  gender: String,
  roles: {
    type: [String],
    default: [ROLE.USER]
  }
})

userSchema.pre('save', function (next) {
  const user = this

  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError)
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError)
          }

          user.password = hash
          next()
        })
      }
    })
  } else {
    return next()
  }
})

module.exports = mongoose.model('User', userSchema)
