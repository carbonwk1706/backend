const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')
const Rating = require('../models/Rating')

const rateBook = async (req, res, next) => {
  const userId = req.body.userId
  const bookId = req.body.bookId
  const rating = req.body.rating
  const comment = req.body.comment

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).send({
      message: 'User not found'
    })
  }

  const book = await Book.findById(bookId)
  if (!book) {
    return res.status(404).send({
      message: 'Book not found'
    })
  }

  if (!user.inventory.includes(bookId)) {
    return res.status(400).send({
      message: 'You have not purchased this book'
    })
  }

  const ratings = new Rating({ user: userId, book: bookId, rating, comment })
  await ratings.save()

  user.ratings.push({ book: bookId, rating, comment })
  await user.save()

  book.reviews.push({ user: userId, rating, comment })
  await book.save()

  book.ratingsCount = book.ratingsCount ? book.ratingsCount + 1 : 1
  book.rating = (book.rating * (book.ratingsCount - 1) + rating) / book.ratingsCount
  await book.save()

  req.app.get('io').emit('new-rating')
  res.status(200).send({
    message: 'Book rating and comment updated'
  })
}

router.post('/', rateBook)
module.exports = router
