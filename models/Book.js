const mongoose = require('mongoose')
const { Schema } = mongoose
const bookSchema = Schema({
  name: String,
  author: String,
  publisher: String,
  catagory: String,
  price: Number,
  imageBook: String
})

module.exports = mongoose.model('Book', bookSchema)
