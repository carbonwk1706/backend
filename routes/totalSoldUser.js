const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getUserTotalSoldAndRevenue = async function (req, res) {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId).populate('bookSell')
    if (!user) return res.status(404).send('User not found')
    let totalSold = 0
    let totalRevenue = 0
    user.bookSell.forEach(book => {
      if (book.sold > 0) {
        totalSold += book.sold
        totalRevenue += book.sold * book.price
      }
    })
    user.totalSold = totalSold
    user.totalRevenue = totalRevenue
    await user.save()
    res.status(200).json({ user })
  } catch (error) {
    res.status(500).send(error)
  }
}

const withdrawRevenue = async function (req, res) {
  try {
    const userId = req.params.userId
    const amount = req.body.amount
    const user = await User.findById(userId).exec()
    if (!user) return res.status(404).send('User not found')
    if (user.totalRevenue < amount) return res.status(400).send('Not enough revenue')
    user.totalRevenue -= amount
    await user.save()
    res.status(200).json({ user, totalRevenue: user.totalRevenue })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/:userId', getUserTotalSoldAndRevenue)
router.put('/:userId/withdraw', withdrawRevenue)
module.exports = router
