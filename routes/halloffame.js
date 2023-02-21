const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const halloffame = async function (req, res) {
  Book.find()
    .sort({ ratingsCount: -1, rating: -1, sold: -1 })
    .then((books) => {
      const newBooks = books.filter(book => book.ratingsCount >= 1 && book.rating >= 4 && book.sold >= 1)
      res.status(200).send(newBooks)
    })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

const halloffameCartoon = async function (req, res, next) {
  const category = 'การ์ตูนทั่วไป'
  Book.find().find({ category }).sort({ ratingsCount: -1, rating: -1, sold: -1 }).then((books) => {
    const newBooks = books.filter(book => book.ratingsCount >= 1 && book.rating >= 4 && book.sold >= 1)
    res.status(200).send(newBooks)
  })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

const halloffameNovel = async function (req, res, next) {
  const category = 'นิยาย'
  Book.find().find({ category }).sort({ ratingsCount: -1, rating: -1, sold: -1 }).then((books) => {
    const newBooks = books.filter(book => book.ratingsCount >= 1 && book.rating >= 4 && book.sold >= 1)
    res.status(200).send(newBooks)
  })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

router.get('/', halloffame)
router.get('/cartoon', halloffameCartoon)
router.get('/novel', halloffameNovel)
module.exports = router
