const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getRoles = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    res.json({ user: { _id: user._id, roles: user.roles } })
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.get('/:id', getRoles)
module.exports = router
