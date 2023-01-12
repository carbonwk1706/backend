const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateAccessToken } = require('../helpers/auth')

const login = async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  try {
    const user = await User.findOne({ username }).exec()
    const verifyResult = await bcrypt.compare(password, user.password)
    if (!verifyResult) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    const token = generateAccessToken({ _id: user.id, username: user.username })
    res.json({ user: { _id: user._id, username: user.username, roles: user.roles }, token })
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.post('/login', login)
module.exports = router
