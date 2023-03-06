const express = require('express')
const router = express.Router()
const DeletedBook = require('../models/DeletedBook')

const getBook = async function (req, res, next) {
  const bookId = req.params.id
  try {
    const book = await DeletedBook.findOne({ bookId }).exec()
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

router.get('/:id', getBook)
module.exports = router
