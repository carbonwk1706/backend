const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const recommended = async function (req, res) {
  Book.find()
    .sort({ ratingsCount: -1, rating: -1 })
    .then((books) => {
      res.status(200).send(books)
    })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

const recommended7d = async function (req, res) {
  Book.find()
    .sort({ ratingsCount: -1, rating: -1 })
    .then((books) => {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const newBooks = books.filter(book => book.updatedAt >= sevenDaysAgo)
      res.status(200).send(newBooks)
    })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

router.get('/', recommended)
router.get('/new', recommended7d)
module.exports = router
