const mongoose = require('mongoose')
const { Schema } = mongoose

const bestsellerSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  count: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Bestseller', bestsellerSchema)
