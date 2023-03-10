const express = require('express')
const router = express.Router()
const User = require('../models/User')
const RequestBook = require('../models/RequestBook')
const nodemailer = require('nodemailer')
const Book = require('../models/Book')
const HistoryCRUDBook = require('../models/HistoryCRUDBook')

const request = async function (req, res, next) {
  const user = req.body.user
  const request = req.body.request
  const pdf = req.body.pdf
  const name = req.body.name
  const author = req.body.author
  const publisher = req.body.publisher
  const category = req.body.category
  const price = req.body.price
  const imageBook = req.body.imageBook

  const newRequestBook = new RequestBook({
    request,
    user,
    pdf,
    name,
    author,
    publisher,
    category,
    price,
    imageBook
  })

  try {
    const findUser = await User.findById(newRequestBook.user)
    findUser.requestBookHistory.push(newRequestBook)
    await newRequestBook.save()
    await findUser.save()
    req.app.get('io').emit('new-request-book', { findUser, newRequestBook })
    res.status(201).json({
      findUser, newRequestBook
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getRequests = async function (req, res, next) {
  try {
    const requests = await RequestBook.find({ status: 'pending' })
    res.send({ requests })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await RequestBook.findById(id)
    res.send({ request })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getRequestHistory = async function (req, res, next) {
  const userId = req.params.userId

  try {
    const user = await User.findById(userId).populate('requestBookHistory')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user.requestBookHistory)
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const approveRequest = async function (req, res, next) {
  const id = req.params.id
  const adminId = req.body.adminId
  try {
    const request = await RequestBook.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'approved'
    request.approvedBy = adminId
    request.approvedAt = Date.now()
    await request.save()
    const user = await User.findById(request.user)
    const newBook = new Book({
      name: request.name,
      author: request.author,
      publisher: request.publisher,
      category: request.category,
      price: request.price,
      imageBook: request.imageBook,
      pdf: request.pdf
    })
    await newBook.save()

    user.bookSell.push(newBook)
    await user.save()
    const admin = await User.findById(adminId)
    const history = new HistoryCRUDBook({
      action: 'add',
      bookId: newBook._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUDBook.push(history)
    await admin.save()

    user.historyCRUDBook.push(history)
    await user.save()

    admin.processedRequestsBook.push(request._id)
    await admin.save()
    const notification = JSON.stringify({
      type: 'เรื่อง : การยื่นขอขายหนังสือ',
      message: 'การยื่นขอขายหนังสือของคุณถูกอนุมัติ',
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
      subject: 'เรื่อง : การยื่นขอขายหนังสือ',
      text: 'การยื่นขอขายหนังสือของคุณถูกอนุมัติ',
      html: '<p>การยื่นขอขายหนังสือของคุณถูกอนุมัติ</p>'
    }

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    req.app.get('io').emit('requestbook-approved', { request, user, admin, newBook })
    res.send({ request, user, admin, newBook })
  } catch (error) {

  }
}

const rejectRequest = async function (req, res, next) {
  const id = req.params.id
  const adminId = req.body.adminId
  try {
    const request = await RequestBook.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'rejected'
    request.approvedBy = adminId
    request.approvedAt = Date.now()
    await request.save()
    const admin = await User.findById(adminId)
    admin.processedRequestsBook.push(request._id)
    await admin.save()
    const user = await User.findById(request.user)
    const notification = JSON.stringify({
      type: 'เรื่อง : การยื่นขอขายหนังสือ',
      message: 'การยื่นขอขายหนังสือของคุณถูกปฏิเสธ',
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
      subject: 'เรื่อง : การยื่นขอขายหนังสือ',
      text: 'การยื่นขอขายหนังสือของคุณถูกปฏิเสธ',
      html: '<p>การยื่นขอขายหนังสือของคุณถูกปฏิเสธ</p>'
    }

    transporter.sendMail(message, function (error, info) {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    req.app.get('io').emit('requestbook-rejected', { request, admin })
    res.send({ request, admin })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.post('/', request)
router.get('/', getRequests)
router.get('/:id', getRequest)
router.get('/history/:userId', getRequestHistory)
router.patch('/:id/approve', approveRequest)
router.patch('/:id/reject', rejectRequest)
module.exports = router
