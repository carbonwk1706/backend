const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Request = require('../models/Request')
const Receipt = require('../models/Receipt')

const getProcessedRequests = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const processedRequests = await Request.find({
      _id: { $in: user.processedRequests }
    }).sort({ approvedAt: -1 })
    res.send({ processedRequests })
  } catch (error) {

  }
}

const getProcessedReceipts = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const processedReceipts = await Receipt.find({
      _id: { $in: user.processedReceipts }
    }).sort({ approvedAt: -1 })
    res.send({ processedReceipts })
  } catch (error) {

  }
}

const getProcessedData = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const processedRequests = await Request.find({
      _id: { $in: user.processedRequests }
    })
    const processedReceipts = await Receipt.find({
      _id: { $in: user.processedReceipts }
    })
    const combinedData = processedRequests.concat(processedReceipts)
    combinedData.sort((a, b) => {
      return new Date(b.approvedAt) - new Date(a.approvedAt)
    })
    res.send({ combinedData })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/all/:id', getProcessedData)
router.get('/request/:id', getProcessedRequests)
router.get('/receipts/:id', getProcessedReceipts)
module.exports = router
