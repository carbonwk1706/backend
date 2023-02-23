const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const Book = require('../models/Book')

const getCart = async function (req, res, next) {
  Cart.findOne({ user: req.params.userId })
    .populate('items.product')
    .exec(async (err, cart) => {
      if (err) return res.status(500).send({ error: err.message })

      if (cart) {
        const items = cart.items

        for (let i = 0; i < items.length; i++) {
          const book = await Book.findOne({ _id: items[i].product })
          if (!book) {
            items.splice(i, 1)
            i--
          }
        }

        cart.items = items
        await cart.save()
      }

      res.json(cart)
    })
}

const addBook = async function (req, res, next) {
  Cart.findOne({ user: req.params.userId }, (err, cart) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!cart) {
      cart = new Cart({ user: req.params.userId })
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === req.params.bookId)
    if (itemIndex > -1) {
      res.status(200).send({
        message: 'You have this product in your cart'
      })
    } else {
      cart.items.push({ product: req.params.bookId, quantity: 1 })
      cart.save((saveErr, updatedCart) => {
        if (saveErr) {
          return res.status(500).json({ error: saveErr.message })
        }
        res.json(updatedCart)
      })
    }
  })
}

const removeBook = async function (req, res, next) {
  Cart.findOne({ user: req.params.userId }, (err, cart) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === req.params.bookId)
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1)
    }

    cart.save((saveErr, updatedCart) => {
      if (saveErr) {
        return res.status(500).json({ error: saveErr.message })
      }
      res.json(updatedCart)
    })
  })
}

router.get('/:userId', getCart)
router.post('/:userId/books/:bookId', addBook)
router.delete('/:userId/books/:bookId', removeBook)
module.exports = router
