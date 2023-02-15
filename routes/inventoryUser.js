const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getMyBook = async function (req, res, next) {
  const userId = req.params.userId
  const user = await User.findById(userId).populate('inventory')
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  res.json(user.inventory)
}

router.get('/:userId', getMyBook)
module.exports = router
