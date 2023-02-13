const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')

const addWishList = async function (req, res, next) {
  const userId = req.body.userId
  const bookId = req.body.bookId
  try {
    const user = await User.findById(userId).exec()
    if (!user) return res.status(404).send('User not found.')
    const book = await Book.findById(bookId).exec()
    if (!book) return res.status(404).send('Book not found.')
    const duplicateBook = user.wishlist.find(item => item._id.toString() === book._id.toString())
    if (duplicateBook) {
      return res.status(200).send({
        message: 'Book already exists in wishlist'
      })
    }
    user.wishlist.push(book)
    await user.save()
    res.send({ user })
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

const deleteWishList = async function (req, res, next) {
  const userId = req.body.userId
  const bookId = req.body.bookId
  try {
    const user = await User.findById(userId).exec()
    if (!user) return res.status(404).send('User not found.')
    const book = await Book.findById(bookId).exec()
    if (!book) return res.status(404).send('Book not found.')
    const bookIndex = user.wishlist.findIndex(item => item._id.toString() === book._id.toString())
    if (bookIndex === -1) return res.status(404).send('Book not found in wishlist.')
    user.wishlist.splice(bookIndex, 1)
    await user.save()
    res.status(200).json({
      message: 'Book removed from wishlist'
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

const getWishList = async function (req, res, next) {
  User.findById(req.params.userId)
    .populate('wishlist')
    .exec((err, user) => {
      if (err) return res.status(500).send(err)
      if (!user) return res.status(404).send('User not found')

      res.send(user.wishlist)
    })
}

router.get('/:userId', getWishList)
router.post('/addWishList', addWishList)
router.delete('/deleteWishList', deleteWishList)
module.exports = router
