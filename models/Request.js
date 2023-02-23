const mongoose = require('mongoose')
const { Schema } = mongoose
const RequestSchema = Schema({
  request: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publisher: {
    type: String,
    require: true
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  idCard: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  address: {
    type: String,
    require: true
  },
  road: {
    type: String,
    require: true
  },
  subDistrict: {
    type: String,
    require: true
  },
  district: {
    type: String,
    require: true
  },
  province: {
    type: String,
    require: true
  },
  postCode: {
    type: String,
    require: true
  },
  bankAccount: {
    type: String,
    require: true
  },
  idAccount: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('Request', RequestSchema)
