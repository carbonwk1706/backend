const express = require('express')
const router = express.Router()
const User = require('../models/User')

const notifications = async function (req, res, next) {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).send('User not found')

    const notifications = user.notifications
    res.send({ notifications })
  } catch (error) {
    res.status(500).send({
      message: error
    })
  }
}

router.get('/:userId', notifications)
module.exports = router
