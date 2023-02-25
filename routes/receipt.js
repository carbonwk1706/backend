const express = require('express')
const router = express.Router()
const Receipt = require('../models/Receipt')
const User = require('../models/User')

const request = async function (req, res, next) {
  const request = req.body.request
  const slipDate = req.body.slipDate
  const slipTime = req.body.slipTime
  const user = req.body.user
  const username = req.body.username
  const amount = req.body.amount
  const method = req.body.method

  const newReceipt = new Receipt({
    request,
    slipDate,
    slipTime,
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
    return res.status(500).send({
      message: error.message
    })
  }
}

const receiptDetail = async function (req, res) {
  const receiptId = req.params.receiptId
  const userId = req.params.userId
  const user = await User.findById(userId).populate('receiptHistory')
  const receiptHistory = user.receiptHistory.find(receiptHistory => receiptHistory._id.toString() === receiptId)
  res.send(receiptHistory)
}

router.post('/', request)
router.get('/:userId', getReceipt)
router.get('/:receiptId/:userId', receiptDetail)
module.exports = router
