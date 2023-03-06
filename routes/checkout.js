const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const User = require('../models/User')
const Book = require('../models/Book')

const checkout = async function (req, res, next) {
  const userId = req.body.userId
  const selectedItems = req.body.selectedItems
  const user = await User.findById(userId)

  let totalCost = 0

  for (let i = 0; i < selectedItems.length; i++) {
    const book = await Book.findById(selectedItems[i].product)
    totalCost += book.price * selectedItems[i].quantity
  }

  if (user.coin < totalCost) {
    return res.status(201).send({
      message: 'not enough money'
    })
  }

  for (let i = 0; i < selectedItems.length; i++) {
    const book = await Book.findById(selectedItems[i].product)

    book.sold += selectedItems[i].quantity
    await book.save()
  }

  const updateUser = await User.findByIdAndUpdate(userId, {
    $inc: { coin: -totalCost },
    $push: {
      inventory: { $each: selectedItems.map(item => item.product) },
      receiptBooks: [{
        books: selectedItems.map(item => item.product),
        oldData: selectedItems.map(item => item.product),
        totalCost,
        count: selectedItems.length,
        createdAt: new Date()
      }]
    }
  }, { new: true })

  const cart = await Cart.findOne({ user: userId })
  for (let i = 0; i < selectedItems.length; i++) {
    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === selectedItems[i].product._id.toString())
    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1)
    }
  }
  await cart.save()
  req.app.get('io').emit('product-sell')
  res.status(200).json({ user: updateUser, cart })
}

router.post('/', checkout)
module.exports = router
