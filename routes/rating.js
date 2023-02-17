const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')

const rateBook = async (req, res, next) => {
  const userId = req.body.userId
  const bookId = req.body.bookId
  const rating = req.body.rating

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

  user.ratings.push({ book: bookId, rating })
  await user.save()

  book.rating = (book.rating + rating)
  await book.save()

  res.status(200).send({
    message: 'Book rating updated'
  })
}

router.post('/', rateBook)
module.exports = router
