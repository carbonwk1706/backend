const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const User = require('../models/User')
const DeletedUser = require('../models/DeletedUser')

const allReviews = async function (req, res) {
  try {
    const books = await Book.find({
      'reviews.0': { $exists: true }
    }).sort({ 'reviews.createdAt': -1 }).populate('reviews.user').exec()
    const bookPromises = books.map(async book => {
      const newReviews = book.reviews.map(async review => {
        const user = await User.findById(review.user)
        if (!user) {
          const deletedUser = await DeletedUser.findOne({ userId: review.user })
          if (!deletedUser) {
            return {
              rating: review.rating,
              comment: review.comment,
              name: 'User not found',
              imageUrl: '',
              createdAt: review.createdAt
            }
          }

          return {
            rating: review.rating,
            comment: review.comment,
            name: deletedUser.name + ' (บัญชีนี้ถูกลบไปแล้ว)',
            imageUrl: deletedUser.imageUrl,
            createdAt: review.createdAt
          }
        }

        return {
          rating: review.rating,
          comment: review.comment,
          name: user.name,
          imageUrl: user.imageUrl,
          createdAt: review.createdAt
        }
      })

      const reviews = await Promise.all(newReviews)
      return { ...book._doc, reviews }
    })

    const updatedBooks = await Promise.all(bookPromises)
    res.status(200).send(updatedBooks)
  } catch (err) {
    res.status(500).send(err)
  }
}

router.get('/books/reviews', allReviews)
module.exports = router
