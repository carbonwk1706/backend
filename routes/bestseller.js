const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const bestseller = async function (req, res, next) {
  const books = await Book.find().sort({ sold: -1 })
  res.json(books)
}

router.get('/', bestseller)
module.exports = router
