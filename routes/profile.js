const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    res.json({ user: { _id: user._id, name: user.name, username: user.username, email: user.email, gender: user.gender, roles: user.roles } })
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

const updateUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    user.name = req.body.name
    user.gender = req.body.gender
    await user.save()
    return res.status(200).json(user)
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

router.get('/:id', getUser)
router.put('/:id', updateUser)
module.exports = router
