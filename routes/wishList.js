const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Book = require('../models/Book')

const addWishList = async function (req, res, next) {
  const userId = req.body.id
  const bookId = req.body.id

  const user = await User.findOne({ userId }).exec()
  if (!user) return res.status(404).send('User not found.')

  const book = await Book.findOne({ bookId }).exec()
  if (!book) return res.status(404).send('Book not found.')

  const duplicateBook = user.wishlist.find(item => item._id.toString() === book._id.toString())
  if (duplicateBook) {
    return res.status(200).send({
      message: 'Book already exists in wishlist.'
    })
  }
  user.wishlist.push(book)
  await user.save()
  res.send({ user })
}

router.post('/remove-from-wishlist', async (req, res) => {
  const user = await User.findById(req.user.id)
  if (!user) return res.status(404).send('User not found.')

  const bookIndex = user.wishlist.findIndex(b => b._id.toString() === req.body.bookId)
  if (bookIndex === -1) return res.status(404).send('Book not found in wishlist.')

  user.wishlist.splice(bookIndex, 1)
  await user.save()

  res.send('Book removed from wishlist.')
})

const getWishList = async function (req, res, next) {
  User.findById(req.params.userId)
    .populate('wishlist')
    .exec((err, user) => {
      if (err) return res.status(500).send(err)
      if (!user) return res.status(404).send('User not found')

      res.send(user.wishlist)
    })
}

router.post('/addWishList', addWishList)
router.get('/:userId', getWishList)
module.exports = router
