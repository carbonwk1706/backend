const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const searchBook = async function (req, res, next) {
  const { searchTerm } = req.query
  const searchQuery = {
    $or: [
      { name: new RegExp(searchTerm, 'i') },
      { author: new RegExp(searchTerm, 'i') },
      { publisher: new RegExp(searchTerm, 'i') }
    ]
  }

  const books = await Book.find(searchQuery)
  res.send(books)
}
router.get('/', searchBook)
module.exports = router
