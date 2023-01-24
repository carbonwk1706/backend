const mongoose = require('mongoose')
const { Schema } = mongoose
const bookSchema = Schema({
  name: String,
  author: String,
  publisher: String,
  category: String,
  price: Number,
  imageBook: String,
  sales: Number
})

module.exports = mongoose.model('Book', bookSchema)
