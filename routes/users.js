const express = require('express')
const router = express.Router()
const User = require('../models/User')

const getUsers = async function (req, res, next) {
  try {
    const users = await User.find({}).exec()
    res.status(200).json(users)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    res.json(user)
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

const addUsers = async function (req, res, next) {
  const newUser = new User({
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    gender: req.body.gender,
    roles: req.body.roles
  })
  try {
    await newUser.save()
    req.app.get('io').emit('add-new')
    res.status(201).json(newUser)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const updateUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    user.name = req.body.name
    user.username = req.body.username
    user.password = req.body.password
    user.email = req.body.email
    user.gender = req.body.gender
    user.roles = req.body.roles
    await user.save()
    req.app.get('io').emit('update-user')
    return res.status(200).json(user)
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

const deleteUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    await User.findByIdAndDelete(user)
    req.app.get('io').emit('delete-user')
    return res.status(200).send()
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUsers)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)
module.exports = router
