const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const newEntry = async function (req, res, next) {
  const books = await Book.find().sort({ createdAt: -1 })
  res.json(books)
}

router.get('/', newEntry)
module.exports = router
