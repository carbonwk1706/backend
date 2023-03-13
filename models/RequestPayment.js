const mongoose = require('mongoose')
const { Schema } = mongoose
const RequestPaymentSchema = Schema({
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  imageBankAccount: {
    type: String
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
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
  },
  phone: {
    type: String,
    require: true
  },
  amount: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('RequestPayment', RequestPaymentSchema)
