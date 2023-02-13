const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const confirmPassword = async function (req, res, next) {
  const id = req.body.id
  const password = req.body.password
  try {
    const user = await User.findById(id).exec()

    const verifyResult = await bcrypt.compare(password, user.password)
    if (!verifyResult) {
      return res.status(200).json({
        message: 'Invalid password'
      })
    }
    res.status(200).json({
      message: 'Correct password'
    })
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

router.post('/', confirmPassword)
module.exports = router
