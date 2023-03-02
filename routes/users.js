const express = require('express')
const router = express.Router()
const User = require('../models/User')
const HistoryCRUD = require('../models/historyCRUD')

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
    const adminId = req.body.adminId
    const admin = await User.findById(adminId).exec()
    const history = new HistoryCRUD({
      action: 'add',
      userId: newUser._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUD.push(history)
    await admin.save()
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
    const adminId = req.body.adminId
    const admin = await User.findById(adminId).exec()
    const history = new HistoryCRUD({
      action: 'update',
      userId: user._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUD.push(history)
    await admin.save()
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
    const adminId = req.body.adminId
    const admin = await User.findById(adminId).exec()
    const history = new HistoryCRUD({
      action: 'delete',
      userId: user._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUD.push(history)
    await admin.save()
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
