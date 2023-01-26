const express = require('express')
const router = express.Router()
const Cart = require('../models/Cart')
const User = require('../models/User')

const getCartList = async function (req, res, next) {
  try {
    const carts = await Cart.find({}).exec()
    res.status(200).json(carts)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const cartList = async function (req, res, next) {
  const user = req.body.user
  const book = req.body.book

  const newCartList = new Cart({
    user,
    book
  })

  try {
    const findUser = await User.findById(newCartList.user)
    findUser.cartHistory.push(newCartList)
    await newCartList.save()
    await findUser.save()

    res.status(201).json({
      findUser
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.get('/', getCartList)
router.post('/', cartList)
module.exports = router
