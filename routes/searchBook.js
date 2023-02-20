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
const searchInventoryBookName = async function (req, res, next) {
  const { searchTerm } = req.query

  const searchQuery = {
    name: new RegExp(searchTerm, 'i')
  }

  const userId = req.query.userId
  const user = await User.findById(userId).populate('inventory')
  const books = user.inventory.filter(book => new RegExp(searchQuery.name, 'i').test(book.name))

  res.send(books)
}

const searchInventoryBookAuthor = async function (req, res, next) {
  const { searchTerm } = req.query

  const searchQuery = {
    name: new RegExp(searchTerm, 'i')
  }

  const userId = req.query.userId
  const user = await User.findById(userId).populate('inventory')
  const books = user.inventory.filter(book => new RegExp(searchQuery.name, 'i').test(book.author))

  res.send(books)
}

const searchInventoryBookPublisher = async function (req, res, next) {
  const { searchTerm } = req.query

  const searchQuery = {
    name: new RegExp(searchTerm, 'i')
  }

  const userId = req.query.userId
  const user = await User.findById(userId).populate('inventory')
  const books = user.inventory.filter(book => new RegExp(searchQuery.name, 'i').test(book.publisher))

  res.send(books)
}

router.get('/', searchBook)
router.get('/inventory/name', searchInventoryBookName)
router.get('/inventory/author', searchInventoryBookAuthor)
router.get('/inventory/publisher', searchInventoryBookPublisher)
module.exports = router
