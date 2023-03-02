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

const getAllBooks = async function (req, res, next) {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 }).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getBooksCartoon = async function (req, res, next) {
  try {
    const category = 'การ์ตูนทั่วไป'
    const books = await Book.find({ category }).sort({ createdAt: -1 }).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getBooksNovel = async function (req, res, next) {
  try {
    const category = 'นิยาย'
    const books = await Book.find({ category }).sort({ createdAt: -1 }).exec()
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
    author: req.body.author,
    publisher: req.body.publisher,
    category: req.body.category,
    price: req.body.price,
    imageBook: req.body.imageBook
  })
  try {
    await newBook.save()
    req.app.get('io').emit('update-book-create')
    res.status(201).json(newBook)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const updateBook = async function (req, res, next) {
  const bookId = req.params.id
  try {
    const book = await Book.findById(bookId).exec()
    book.name = req.body.name
    book.author = req.body.author
    book.publisher = req.body.publisher
    book.category = req.body.category
    book.price = req.body.price
    book.imageBook = req.body.imageBook
    await book.save()
    req.app.get('io').emit('update-book-edit')
    return res.status(200).json(book)
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

const deleteBook = async function (req, res, next) {
  const bookId = req.params.id
  try {
    const book = await Book.findById(bookId).exec()
    if (book === null) {
      return res.status(404).json({
        message: 'Book not found!!'
      })
    }
    await Book.findByIdAndDelete(book)
    req.app.get('io').emit('update-book-delete')
    return res.status(200).send()
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.get('/', getBooks)
router.get('/all', getAllBooks)
router.get('/cartoon', getBooksCartoon)
router.get('/novel', getBooksNovel)
router.get('/:id', getBook)
router.post('/', addBooks)
router.put('/:id', updateBook)
router.delete('/:id', deleteBook)
module.exports = router
