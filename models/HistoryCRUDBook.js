const mongoose = require('mongoose')
const { Schema } = mongoose
const HistoryCRUDBookSchema = Schema({
  action: {
    type: String,
    require: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
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
  },
  oldData: {
    type: Object
  },
  newData: {
    type: Object
  }
})

module.exports = mongoose.model('HistoryCRUDBook', HistoryCRUDBookSchema)
