const express = require('express')
const router = express.Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
function generateAccessToken (user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1d' })
}

const login = async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  try {
    const user = await User.findOne({ username, password }, '-password').exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    const token = generateAccessToken({ username: user.username, roles: user.roles })
    res.json({ user, token })
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.post('/login', login)
module.exports = router
