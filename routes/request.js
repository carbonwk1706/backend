const express = require('express')
const router = express.Router()
const Request = require('../models/Request')
const User = require('../models/User')

const request = async function (req, res, next) {
  const user = req.body.user
  const request = req.body.request

  const newRequest = new Request({
    user,
    request
  })

  try {
    const findUser = await User.findById(newRequest.user)
    findUser.requestHistory.push(newRequest)
    await newRequest.save()
    await findUser.save()

    res.status(201).json({
      findUser
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

router.post('/', request)
module.exports = router
