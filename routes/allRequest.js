const express = require('express')
const router = express.Router()
const Receipt = require('../models/Receipt')
const Request = require('../models/Request')

const getRequestsAndReceipts = async function (req, res, next) {
  try {
    const requests = await Request.find({ status: 'pending' }).sort({ createdAt: 1 })
    const receipts = await Receipt.find({ status: 'pending' }).sort({ createdAt: 1 })
    const combinedData = requests.concat(receipts)
    combinedData.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt)
    })
    res.send({ combinedData })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/', getRequestsAndReceipts)
module.exports = router
