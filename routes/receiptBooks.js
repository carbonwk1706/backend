const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getReceiptBooks = async function (req, res) {
  const userId = req.params.userId
  const user = await User.findById(userId).populate('receiptBooks')
  res.send(user.receiptBooks)
}

const receiptBookDetail = async function (req, res) {
  const receiptBookId = req.params.receiptBookId
  const userId = req.params.userId
  const user = await User.findById(userId).populate('receiptBooks.books')
  const receiptBook = user.receiptBooks.find(receiptBook => receiptBook._id.toString() === receiptBookId)
  res.send(receiptBook)
}

router.get('/:userId', getReceiptBooks)
router.get('/:receiptBookId/:userId', receiptBookDetail)
module.exports = router
