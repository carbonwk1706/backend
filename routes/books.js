const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const getBooks = async function (req, res, next) {
  try {
    const books = await Book.find({}).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getBook = async function (req, res, next) {
  const bookId = req.params.id
  try {
    const book = await Book.findById(bookId).exec()
    if (book === null) {
      return res.status(404).json({
        message: 'Book not found!!'
      })
    }
    res.json(book)
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

const addBooks = async function (req, res, next) {
  const newBook = new Book({
    name: req.body.name,
    auther: req.body.auther,
    publisher: req.body.publisher,
    catagory: req.body.catagory,
    price: req.body.price,
    imageBook: req.body.imageBook
  })
  try {
    await newBook.save()
    res.status(201).json(newBook)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.get('/', getBooks)
router.get('/:id', getBook)
router.post('/', addBooks)
module.exports = router
