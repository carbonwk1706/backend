const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const User = require('../models/User')
const Book = require('../models/Book')

const checkout = async function (req, res, next) {
  const userId = req.body.userId
  const items = req.body.items

  const user = await User.findById(userId)

  let totalCost = 0

  for (let i = 0; i < items.length; i++) {
    const book = await Book.findById(items[i].product)
    totalCost += book.price * items[i].quantity
  }

  if (user.coin < totalCost) {
    return res.status(201).send({
      message: 'not enough money'
    })
  }

  const updateUser = await User.findByIdAndUpdate(userId, {
    $inc: { coin: -totalCost },
    $push: { inventory: { $each: items.map(item => item.product) } }
  }, { new: true })

  const cart = await Cart.findOneAndUpdate({ user: userId }, { items: [] })
  res.status(200).json({ user: updateUser, cart })
}

router.post('/', checkout)
module.exports = router
