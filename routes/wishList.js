const express = require('express')
const User = require('../models/User')
const Wish = require('../models/wish')
const router = express.Router()

const wishList = async function (req, res, next) {
  const user = req.body.user
  const wish = req.body.wish

  const newWish = new Wish({
    user,
    wish
  })
  try {
    const findUser = await User.findById(newWish.user)
    findUser.wishList.push(newWish)
    await newWish.save()
    await findUser.save()

    res.status(201).json({
      findUser
    })
  } catch (err) {
    res.status(500).send(err)
  }
}

const getWishLists = async function (req, res, next) {
  const userId = req.query.userId
  try {
    const wishLists = await Wish.find({ userId })
    res.send({ wishLists })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/', getWishLists)
router.post('/', wishList)
module.exports = router
