const express = require('express')
const router = express.Router()
const Receipt = require('../models/Receipt')
const User = require('../models/User')

const getRequests = async function (req, res, next) {
  try {
    const receipt = await Receipt.find({ status: 'pending' })
    res.send({ receipt })
  } catch (error) {
    res.status(500).send(error)
  }
}

const getRequest = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Receipt.findById(id)
    res.send({ request })
  } catch (error) {
    res.status(500).send(error)
  }
}

const approveRequest = async function (req, res, next) {
  const id = req.params.id
  const adminId = req.body.adminId
  try {
    const request = await Receipt.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'approved'
    request.approvedBy = adminId
    request.approvedAt = Date.now()
    await request.save()
    const user = await User.findById(request.user)
    user.coin += request.amount
    await user.save()
    const admin = await User.findById(adminId)
    admin.processedReceipts.push(request._id)
    await admin.save()
    const notification = JSON.stringify({
      type: 'เรื่อง แจ้งชำระการเติม Coin',
      message: 'การแจ้งชำระการขอเติม Coin ของคุณถูกอนุมัติแล้ว',
      createdAt: new Date()
    })
    user.notifications.push(notification)
    await user.save()
    req.app.get('io').emit('receipt-approved', { request, user, admin })
    res.send({ request, user, admin })
  } catch (error) {
    res.status(500).send(error)
  }
}

const rejectRequest = async function (req, res, next) {
  const id = req.params.id
  const adminId = req.body.adminId
  try {
    const request = await Receipt.findById(id)
    if (!request) return res.status(404).send('Request not found')
    request.status = 'rejected'
    request.approvedBy = adminId
    request.approvedAt = Date.now()
    await request.save()
    const admin = await User.findById(adminId)
    admin.processedReceipts.push(request._id)
    await admin.save()
    const user = await User.findById(request.user)
    const notification = JSON.stringify({
      type: 'เรื่อง แจ้งชำระการเติม Coin',
      message: 'การแจ้งชำระการขอเติม Coin ของคุณถูกปฏิเสธ',
      createdAt: new Date()
    })
    user.notifications.push(notification)
    await user.save()
    req.app.get('io').emit('receipt-rejected', { request, admin })
    res.send({ request, admin })
  } catch (error) {
    res.status(500).send({
      message: error
    })
    console.log(error)
  }
}

router.get('/', getRequests)
router.get('/:id', getRequest)
router.patch('/:id/approve', approveRequest)
router.patch('/:id/reject', rejectRequest)
module.exports = router
