const mongoose = require('mongoose')
const { Schema } = mongoose
const CartSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }
})

module.exports = mongoose.model('Cart', CartSchema)
