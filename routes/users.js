const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const User = require('../models/User')
const HistoryCRUD = require('../models/historyCRUD')
const DeletedUser = require('../models/DeletedUser')

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
      return res.status(200).json({
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
    const originalUser = await User.findById(userId).exec()
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
      adminId: admin._id,
      oldData: originalUser,
      newData: user
    })
    await history.save()
    admin.historyCRUD.push(history)
    await admin.save()
    const notification = JSON.stringify({
      type: 'เรื่อง : ID ของคุณถูกแก้ไขโดยผู้ดูแลระบบ',
      message: 'ID ของคุณถูกแก้ไขโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ',
      createdAt: new Date()
    })
    user.notifications.push(notification)
    await user.save()
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      port: 587,
      secure: false,
      auth: {
        user: 'captenlnw_za@hotmail.com',
        pass: ''
      }
    })
    const message = {
      from: 'captenlnw_za@hotmail.com',
      to: originalUser.email,
      subject: 'เรื่อง : ID ของคุณถูกแก้ไขโดยผู้ดูแลระบบ',
      text: 'ID ของคุณถูกแก้ไขโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ',
      html: '<p>ID ของคุณถูกแก้ไขโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ</p>'
    }

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    req.app.get('io').emit('update-user', {
      user
    })
    return res.status(200).json(user)
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

const deleteUser = async function (req, res, next) {
  const userId = req.params.id
  const adminId = req.params.adminId
  try {
    const user = await User.findById(userId).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    const deletedUser = { ...user._doc }
    await User.findByIdAndDelete(userId)
    const admin = await User.findById(adminId).exec()
    if (admin === null) {
      return res.status(404).json({
        message: 'Admin not found!!'
      })
    }
    const userDeleted = new DeletedUser({
      imageUrl: deletedUser.imageUrl,
      userId: deletedUser._id,
      publisher: deletedUser.publisher,
      firstName: deletedUser.firstName,
      lastName: deletedUser.lastName,
      idCard: deletedUser.idCard,
      name: deletedUser.name,
      username: deletedUser.username,
      email: deletedUser.email,
      phone: deletedUser.phone,
      address: deletedUser.address,
      road: deletedUser.road,
      subDistrict: deletedUser.subDistrict,
      district: deletedUser.district,
      province: deletedUser.province,
      postCode: deletedUser.postCode,
      bankAccount: deletedUser.bankAccount,
      idAccount: deletedUser.idAccount,
      coin: deletedUser.coin,
      gender: deletedUser.gender,
      roles: deletedUser.roles,
      createdAt: deletedUser.createdAt
    })
    await userDeleted.save()
    const history = new HistoryCRUD({
      action: 'delete',
      userId: deletedUser._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUD.push(history)
    await admin.save()
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      port: 587,
      secure: false,
      auth: {
        user: 'captenlnw_za@hotmail.com',
        pass: ''
      }
    })
    const message = {
      from: 'captenlnw_za@hotmail.com',
      to: userDeleted.email,
      subject: 'เรื่อง : ID ของคุณถูกลบโดยผู้ดูแลระบบ',
      text: 'ID ของคุณถูกลบโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ',
      html: '<p>ID ของคุณถูกลบโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ</p>'
    }

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    req.app.get('io').emit('delete-user', {
      userDeleted
    })
    return res.status(200).send({
    })
  } catch (err) {
    console.log(err.message)
    return res.status(404).send({
      message: err.message
    })
  }
}

router.get('/', getUsers)
router.get('/:id', getUser)
router.post('/', addUsers)
router.put('/:id', updateUser)
router.delete('/:id/:adminId', deleteUser)
module.exports = router
