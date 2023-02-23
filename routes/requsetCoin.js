const express = require('express')
const router = express.Router()
const Receipt = require('../models/Receipt')

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

router.get('/', getRequests)
router.get('/:id', getRequest)
module.exports = router
