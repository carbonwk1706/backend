const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const allReviews = async function (req, res) {
  try {
    const books = await Book.find({
      'reviews.0': { $exists: true }
    }).sort({ 'reviews.createdAt': -1 }).populate('reviews.user').exec()
    res.send(books)
  } catch (err) {
    res.status(500).send(err)
  }
}

router.get('/books/reviews', allReviews)
module.exports = router
