const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const halloffame = async function (req, res) {
  Book.find()
    .sort({ ratingsCount: -1, rating: -1 })
    .then((books) => {
      res.status(200).send(books)
    })
    .catch((error) => {
      res.status(500).send({ message: error.message })
    })
}

router.get('/', halloffame)
module.exports = router
