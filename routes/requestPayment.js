const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const RequestPayment = require('../models/RequestPayment')
const User = require('../models/User')

const request = async function (req, res, next) {
  const request = req.body.request
  const user = req.body.user
  const username = req.body.username
  const imageBankAccount = req.body.imageBankAccount
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const bankAccount = req.body.bankAccount
  const idAccount = req.body.idAccount
  const phone = req.body.phone
  const amount = parseInt(req.body.amount)
  const users = await User.findById(user).exec()
  if (!users) return res.status(404).send('User not found')
  if (amount > users.totalRevenue) return res.status(200).send('Not enough revenue')
  users.balance = users.balance + amount
  if (users.balance > users.totalRevenue) return res.status(200).send('Not enough revenue')
  await users.save()
  const newRequest = new RequestPayment({
    request,
    user,
    username,
    imageBankAccount,
    firstName,
    lastName,
    bankAccount,
    idAccount,
    phone,
    amount
  })

  const findUser = await User.findById(newRequest.user)
  findUser.requestPaymentHistory.push(newRequest)
  await newRequest.save()
  await findUser.save()

  req.app.get('io').emit('new-request-payment', { findUser, newRequest })
  res.status(201).json({
    findUser, newRequest, balance: user.balance
  })
}

const getRequest = async function (req, res, next) {
  const userId = req.params.userId

  try {
    const user = await User.findById(userId).populate('requestPaymentHistory')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    console.log(user)
    res.status(200).json(user.requestPaymentHistory)
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const requestDetail = async function (req, res) {
  const requestId = req.params.requestId
  const userId = req.params.userId
  const user = await User.findById(userId).populate('requestPaymentHistory')
  const requestHistory = user.requestPaymentHistory.find(requestHistory => requestHistory._id.toString() === requestId)
  res.send(requestHistory)
}

const getRequestsAdmin = async function (req, res, next) {
  try {
    const requests = await RequestPayment.find({ status: 'pending' })
    res.send({ requests })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getRequestAdmin = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await RequestPayment.findById(id)
    res.send({ request })
  } catch (error) {
    res.status(500).send(error)
  }
}

const approveRequest = async function (req, res, next) {
  const id = req.params.id
  const adminId = req.body.adminId
  try {
    const request = await RequestPayment.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'approved'
    request.approvedBy = adminId
    request.approvedAt = Date.now()
    await request.save()
    const user = await User.findById(request.user)

    const admin = await User.findById(adminId)

    admin.processedRequestsPayment.push(request._id)
    await admin.save()
    const notification = JSON.stringify({
      type: 'เรื่อง : การแจ้งถอนเงิน',
      message: 'การแจ้งถอนเงินของคุณถูกอนุมัติ',
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
      to: user.email,
      subject: 'เรื่อง : การแจ้งถอนเงิน',
      text: 'การแจ้งถอนเงินของคุณถูกอนุมัติ',
      html: '<p>การแจ้งถอนเงินของคุณถูกอนุมัติ</p>'
    }

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    req.app.get('io').emit('requestpayment-approved', { request, user, admin })
    res.send({ request, user, admin })
  } catch (error) {

  }
}

const rejectRequest = async function (req, res, next) {
  const id = req.params.id
  const adminId = req.body.adminId
  try {
    const request = await RequestPayment.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'rejected'
    request.approvedBy = adminId
    request.approvedAt = Date.now()
    await request.save()
    const admin = await User.findById(adminId)
    admin.processedRequestsPayment.push(request._id)
    await admin.save()
    const user = await User.findById(request.user)
    const notification = JSON.stringify({
      type: 'เรื่อง : การแจ้งถอนเงิน',
      message: 'การแจ้งถอนเงินของคุณถูกปฏิเสธ',
      createdAt: new Date()
    })
    user.notifications.push(notification)
    user.balance -= parseInt(request.amount)
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
      to: user.email,
      subject: 'เรื่อง : การแจ้งถอนเงิน',
      text: 'การแจ้งถอนเงินของคุณถูกปฏิเสธ',
      html: '<p>การแจ้งถอนเงินของคุณถูกปฏิเสธ</p>'
    }

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    req.app.get('io').emit('requestpayment-rejected', { request, admin })
    res.send({ request, admin })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.post('/', request)
router.get('/', getRequestsAdmin)
router.get('/:id', getRequestAdmin)
router.get('/request/:userId', getRequest)
router.get('/:requestId/:userId', requestDetail)
router.patch('/:id/approve', approveRequest)
router.patch('/:id/reject', rejectRequest)
module.exports = router
