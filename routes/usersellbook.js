const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getBooksell = async function (req, res) {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId).populate('BookSell.books').sort({ createdAt: -1 }).exec()
    if (!user) return res.status(404).send('User not found')
    const bookSell = user.BookSell
    res.send(bookSell)
  } catch (error) {
    res.status(500).send(error)
  }
}

const getBooksCartoon = async function (req, res, next) {
  try {
    const userId = req.params.userId
    const category = 'การ์ตูนทั่วไป'
    const user = await User.findById(userId).populate('BookSell.books')
    if (!user) return res.status(404).send('User not found')
    const bookSell = user.BookSell
    const filteredBooks = []
    for (let i = 0; i < bookSell.length; i++) {
      if (bookSell[i].books[0].category === category) {
        filteredBooks.push(bookSell[i])
      }
    }
    res.send(filteredBooks)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}



const getBooksNovel = async function (req, res, next) {
  try {
    const userId = req.params.userId
    const category = 'นิยาย'
    const user = await User.findById(userId).populate('BookSell.books')
    if (!user) return res.status(404).send('User not found')
    const bookSell = user.BookSell
    const filteredBooks = []
    for (let i = 0; i < bookSell.length; i++) {
      if (bookSell[i].books[0].category === category) {
        filteredBooks.push(bookSell[i])
      }
    }
    res.send(filteredBooks)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.get('/:userId', getBooksell)
router.get('/cartoon/:userId', getBooksCartoon)
router.get('/novel/:userId', getBooksNovel)
module.exports = router
