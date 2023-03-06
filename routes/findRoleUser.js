const { ROLE } = require('../constant')
const express = require('express')
const router = express.Router()
const User = require('../models/User')

const findUser = async function (req, res) {
  try {
    const users = await User.find({ roles: ROLE.USER })
    res.status(200).json({ users })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

router.get('/', findUser)
module.exports = router
