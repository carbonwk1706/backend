const mongoose = require('mongoose')
const { Schema } = mongoose
const CarouselImageSchema = Schema({
  imageURL: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model(' CarouselImage', CarouselImageSchema)
