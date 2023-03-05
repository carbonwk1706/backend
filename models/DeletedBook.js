const mongoose = require('mongoose')
const { Schema } = mongoose

const DeletedBookSchema = new Schema({
  pdf: {
    type: String,
    required: true
  },
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
  },
  rating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  sold: {
    type: Number,
    default: 0
  }

})

module.exports = mongoose.model('DeletedBook', DeletedBookSchema)
