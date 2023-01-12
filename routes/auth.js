const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { generateAccessToken } = require('../helpers/auth')

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
    const token = generateAccessToken({ _id: user.id, username: user.username })
    res.json({ user, token })
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.post('/login', login)
module.exports = router
