const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')

const getReviews = async (req, res) => {
  const bookId = req.params.id

  const book = await Book.findById(bookId)
  if (!book) {
    return res.status(404).send({ message: 'Book not found' })
  }

  const reviews = book.reviews
  res.status(200).send(reviews)
}

const getUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    res.json({ user: { imageUrl: user.imageUrl, name: user.name } })
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}
router.get('/:id', getReviews)
router.get('/getUser/:id', getUser)
module.exports = router
