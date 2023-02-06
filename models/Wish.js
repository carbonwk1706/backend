const mongoose = require('mongoose')
const { Schema } = mongoose
const WishSchema = Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  wish: {
    type: [String]
  }
})

module.exports = mongoose.model('Wish', WishSchema)
