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
        totalRevenue += (book.sold * book.price) - 5
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

const getBalance = async function (req, res) {
  try {
    const userId = req.params.userId
    const user = await User.findById(userId).exec()
    if (!user) return res.status(404).send('User not found')
    const balance = user.totalRevenue - user.balance
    res.status(200).json({ balance, idAccount: user.idAccount, bankAccount: user.bankAccount })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/:userId', getUserTotalSoldAndRevenue)
router.get('/balance/:userId', getBalance)
module.exports = router
