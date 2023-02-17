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
  } catch (error) {

  }
}
