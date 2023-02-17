const express = require('express')
const router = express.Router()
const User = require('../models/User')

const checkDuplicateUsername = async function (req, res, next) {
  const userId = req.params.id
  const username = req.body.username
  const email = req.body.email
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    if (username === user.username && email === user.email) {
      return res.status(200).json({
        message: 'Username and Email already exists'
      })
    } else if (username === user.username) {
      return res.status(200).json({
        message: 'Username already exists'
      })
    } else if (email === user.email) {
      return res.status(200).json({
        message: 'Email already exists'
      })
    }
    res.status(201).json({
      message: 'Username and Email already'
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.post('/:id', checkDuplicateUsername)

module.exports = router
