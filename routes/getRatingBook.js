const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')
const DeletedUser = require('../models/DeletedUser')

const getReviews = async (req, res) => {
  const bookId = req.params.id

  const book = await Book.findById(bookId)
  if (!book) {
    return res.status(404).send({ message: 'Book not found' })
  }

  const reviewPromises = book.reviews.map(async review => {
    const user = await User.findById(review.user)
    if (!user) {
      const deletedUser = await DeletedUser.findOne({ userId: review.user })
      if (!deletedUser) {
        return {
          rating: review.rating,
          comment: review.comment,
          name: 'User not found',
          imageUrl: '',
          createAt: review.createdAt
        }
      }

      return {
        rating: review.rating,
        comment: review.comment,
        name: deletedUser.name + ' (บัญชีนี้ถูกลบไปแล้ว)',
        imageUrl: deletedUser.imageUrl,
        createAt: review.createdAt
      }
    }

    return {
      rating: review.rating,
      comment: review.comment,
      name: user.name,
      imageUrl: user.imageUrl,
      createAt: review.createdAt
    }
  })

  const reviews = await Promise.all(reviewPromises)
  res.status(200).send(reviews)
}

router.get('/:id', getReviews)
module.exports = router
