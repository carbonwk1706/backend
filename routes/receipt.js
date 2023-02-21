const express = require('express')
const router = express.Router()
const Receipt = require('../models/Receipt')
const User = require('../models/User')

const request = async function (req, res, next) {
  const request = req.body.request
  const user = req.body.user
  const username = req.body.username
  const amount = req.body.amount
  const method = req.body.method

  const newReceipt = new Receipt({
    request,
    user,
    username,
    amount,
    method
  })

  try {
    const findUser = await User.findById(newReceipt.user)
    findUser.receiptHistory.push(newReceipt)
    await newReceipt.save()
    await findUser.save()

    res.status(201).json({
      findUser
    })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const getReceipt = async function (req, res, next) {
  const userId = req.params.userId

  try {
    const user = await User.findById(userId).populate('receiptHistory')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user.receiptHistory)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

router.post('/', request)
router.get('/:userId', getReceipt)
module.exports = router
