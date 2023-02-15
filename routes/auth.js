const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { generateAccessToken } = require('../helpers/auth')

const login = async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  try {
    const user = await User.findOne({ username }).exec()
    if (!user) {
      return res.status(200).json({
        message: 'Invalid username or password'
      })
    }
    const verifyResult = await bcrypt.compare(password, user.password)
    if (!verifyResult) {
      return res.status(200).json({
        message: 'Invalid username or password'
      })
    }
    const token = generateAccessToken({ _id: user.id, username: user.username })
    res.json({ user: { _id: user._id, name: user.name, username: user.username }, token })
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

const loginadmin = async function (req, res, next) {
  const username = req.body.username
  const password = req.body.password
  const roles = req.body.roles
  try {
    const user = await User.findOne({ username }).exec()
    if (!user) {
      return res.status(200).json({
        message: 'Invalid username or password'
      })
    }
    const verifyResult = await bcrypt.compare(password, user.password)
    if (!verifyResult) {
      return res.status(200).json({
        message: 'Invalid username or password'
      })
    }
    const token = generateAccessToken({ _id: user.id, username: user.username })
    res.json({ user: { _id: user._id, name: user.name, username: user.username ,roles:user.roles}, token })
  } catch (err) {
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

const checkDuplicate = async function (req, res, next) {
  const username = req.body.username
  const email = req.body.email
  try {
    const duplicateUsername = await User.findOne({ username }).exec()
    const duplicateEmail = await User.findOne({ email }).exec()

    if (duplicateUsername || duplicateEmail) {
      return res.status(200).json({
        message: 'Username and Email already exists'
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

const register = async function (req, res, next) {
  const name = req.body.name
  const username = req.body.username
  const password = req.body.password
  const email = req.body.email
  const gender = req.body.gender
  const roles = req.body.roles
  try {
    const newUser = new User({
      name,
      username,
      password,
      email,
      gender,
      roles
    })
    newUser.save()
    res.status(201).json(newUser)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.post('/login', login)
router.post('/duplicate', checkDuplicate)
router.post('/register', register)
module.exports = router
