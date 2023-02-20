const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const User = require('../models/User')

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
const searchInventory = async function (req, res, next) {
  const { searchTerm } = req.query
  console.log(typeof searchTerm)

  const searchQuery = {
    name: new RegExp(searchTerm, 'i')
  }

  const userId = req.query.userId
  console.log('userId:', userId)

  const user = await User.findById(userId).populate('inventory')
  console.log('user:', user)

  const books = user.inventory.filter(book => new RegExp(searchQuery.name, 'i').test(book.name))
  console.log('books:', books)

  res.send(books)
}

router.get('/', searchBook)
router.get('/inventory', searchInventory)
module.exports = router
