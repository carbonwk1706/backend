const express = require('express')
const router = express.Router()
const Rating = require('../models/Rating')
const User = require('../models/User')
const Book = require('../models/Book')
const DeletedBook = require('../models/DeletedBook')
const DeletedUser = require('../models/DeletedUser')

const getRatings = async function (req, res) {
  const ratings = await Rating.find().sort({ createdAt: -1 })

  for (let i = 0; i < ratings.length; i++) {
    const user = await User.findById(ratings[i].user)
    if (user) {
      ratings[i].user = user
    } else {
      const deletedUser = await DeletedUser.findOne({ userId: ratings[i].user })
      if (deletedUser) {
        ratings[i].user = deletedUser
        ratings[i].user.name = deletedUser.name + ' (บัญชีนี้ถูกลบไปแล้ว)'
      }
    }

    const book = await Book.findById(ratings[i].book)
    if (book) {
      ratings[i].book = book
    } else {
      const deletedBook = await DeletedBook.findOne({ bookId: ratings[i].book })
      if (deletedBook) {
        ratings[i].book = deletedBook
        ratings[i].book.name = deletedBook.name + ' (หนังสือเล่มนี้ถูกลบไปแล้ว)'
      }
    }
  }

  res.status(200).send({ ratings })
}

router.get('/', getRatings)
module.exports = router
