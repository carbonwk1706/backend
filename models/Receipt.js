const mongoose = require('mongoose')
const { Schema } = mongoose
const ReceiptSchema = Schema({
  request: {
    type: String,
    required: true
  },
  imageSlip: {
    type: String
  },
  slipDate: {
    type: String,
    require: true
  },
  slipTime: {
    type: String,
    require: true
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
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true
  }

})

module.exports = mongoose.model('Receipt', ReceiptSchema)
