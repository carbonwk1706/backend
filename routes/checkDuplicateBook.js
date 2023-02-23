const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const checkDuplicateName = async function (req, res, next) {
  const name = req.body.name
  try {
    const book = await Book.find({ name }).exec()
    if (book.length > 0) {
      if (name === book[0].name) {
        return res.status(201).json({
          message: 'BookName already exist'
        })
      }
    }
    return res.status(200).json({
      message: 'Can use BookName'
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.post('/', checkDuplicateName)

module.exports = router
