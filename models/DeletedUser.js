const { ROLE } = require('../constant')
const mongoose = require('mongoose')
const { Schema } = mongoose

const DeletedUserSchema = new Schema({
  userId: String,
  publisher: String,
  firstName: String,
  lastName: String,
  idCard: String,
  name: String,
  username: String,
  email: String,
  phone: String,
  address: String,
  road: String,
  subDistrict: String,
  district: String,
  province: String,
  postCode: String,
  bankAccount: String,
  idAccount: String,
  coin: {
    type: Number,
    require: true,
    default: 0
  },
  gender: String,
  roles: {
    type: [String],
    default: [ROLE.USER]
  },
  createdAt: {
    type: Date
  }
})

module.exports = mongoose.model('DeletedUser', DeletedUserSchema)
