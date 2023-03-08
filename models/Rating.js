const mongoose = require('mongoose')
const { Schema } = mongoose

const RatingSchema = Schema({
  user: { type: Object, required: true },
  book: { type: Object, required: true },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Rating', RatingSchema)
