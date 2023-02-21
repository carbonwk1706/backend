const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const recommended = async function (req, res) {
  Book.find()
    .sort({ ratingsCount: -1, rating: -1, sold: -1, createdAt: -1 })
    .then((books) => {
      const newBooks = books.filter(book => book.ratingsCount >= 1 && book.rating >= 4 && book.sold >= 1)
      res.status(200).send(newBooks)
    })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

const recommended7d = async function (req, res) {
  Book.find()
    .sort({ ratingsCount: -1, ratings: -1, sold: -1 })
    .then((books) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const newBooks = books.filter(book => book.createdAt >= sevenDaysAgo && book.ratingsCount >= 1 && book.rating >= 4 && book.sold >= 1)
      res.status(200).send(newBooks)
    })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

router.get('/', recommended)
router.get('/new', recommended7d)
module.exports = router
