const mongoose = require('mongoose')
const { Schema } = mongoose

const RatingSchema = Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  book: { type: Schema.Types.ObjectId, ref: 'Book' },
  rating: { type: Number, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Rating', RatingSchema)
