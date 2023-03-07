const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')
const DeletedBook = require('../models/DeletedBook')

const getReceiptBooks = async function (req, res) {
  const userId = req.params.userId
  const user = await User.findById(userId).populate('receiptBooks')
  const receiptBooks = user.receiptBooks.map(receiptBook => ({
    totalCost: receiptBook.totalCost,
    count: receiptBook.count,
    createdAt: receiptBook.createdAt,
    _id: receiptBook._id
  }))
  res.send(receiptBooks)
}

const receiptBookDetail = async function (req, res) {
  const receiptBookId = req.params.receiptBookId
  const userId = req.params.userId
  const user = await User.findById(userId).populate('receiptBooks.books')
  const receiptBook = user.receiptBooks.find(receiptBook => receiptBook._id.toString() === receiptBookId)
  if (!receiptBook) {
    return res.status(404).send({ error: 'Receipt book not found' })
  }

  const books = []
  for (let i = 0; i < receiptBook.oldData.length; i++) {
    const book = receiptBook.oldData[i]
    const foundBook = await Book.findById(book._id)
    if (foundBook) {
      books.push(foundBook)
    } else {
      const deletedBook = await DeletedBook.findOne({ bookId: book._id })
      if (deletedBook) {
        books.push(deletedBook)
      }
    }
  }
  res.send({
    books, receiptBook
  })
}

router.get('/:userId', getReceiptBooks)
router.get('/:receiptBookId/:userId', receiptBookDetail)
module.exports = router
