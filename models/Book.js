const mongoose = require('mongoose')
const { Schema } = mongoose
const bookSchema = Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageBook: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model('Book', bookSchema)
