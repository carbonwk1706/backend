const mongoose = require('mongoose')
const { Schema } = mongoose
const HistoryCRUDSchema = Schema({
  action: {
    type: String,
    require: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('HistoryCRUD', HistoryCRUDSchema)
