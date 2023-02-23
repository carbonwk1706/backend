const express = require('express')
const router = express.Router()
const User = require('../models/User')

const checkDuplicateUsername = async function (req, res, next) {
  const username = req.body.username
  const email = req.body.email
  try {
    const users = await User.find({ $or: [{ username }, { email }] }).exec()
    if (users.length > 0) {
      if (username === users[0].username && email === users[0].email) {
        return res.status(200).json({
          message: 'Username and Email already exist'
        })
      } else if (username === users[0].username) {
        return res.status(200).json({
          message: 'Username already exists'
        })
      } else if (email === users[0].email) {
        return res.status(200).json({
          message: 'Email already exists'
        })
      }
    }
    return res.status(200).json({
      message: 'Can use Username and Email'
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.post('/', checkDuplicateUsername)

module.exports = router
