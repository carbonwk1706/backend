const express = require('express')
const router = express.Router()
const User = require('../models/User')

const checkUserBook = async function (req, res, next) {
  try {
    const userId = req.params.userId
    const bookId = req.params.bookId

    const user = await User.findById(userId).populate('inventory').exec()
    if (!user) {
      return res.status(404).send({ message: 'User not found' })
    }
    const hasBook = user.inventory.some(book => book._id.equals(bookId))
    if (hasBook) {
      return res.status(200).send({ message: 'User has this book' })
    } else {
      return res.status(200).send({ message: 'User does not have this book' })
    }
  } catch (err) {
    return res.status(500).send({ message: err.message })
  }
}

router.post('/:userId/books/:bookId', checkUserBook)
module.exports = router
