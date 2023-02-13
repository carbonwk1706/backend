const mongoose = require('mongoose')
const { Schema } = mongoose
const cartSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }]
})

module.exports = mongoose.model('Cart', cartSchema)
