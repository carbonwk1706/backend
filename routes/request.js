const express = require('express')
const router = express.Router()
const Request = require('../models/Request')
const User = require('../models/User')

const request = async function (req, res, next) {
  const user = req.body.user
  const request = req.body.request
  const publisher = req.body.publisher
  const name = req.body.name
  const surname = req.body.surname
  const idCard = req.body.idCard
  const phone = req.body.phone
  const address = req.body.address
  const road = req.body.road
  const subDistrict = req.body.subDistrict
  const district = req.body.district
  const postCode = req.body.postCode
  const province = req.body.province
  const bankAccount = req.body.bankAccount
  const idAccount = req.body.idAccount

  const newRequest = new Request({
    user,
    request,
    publisher,
    name,
    surname,
    idCard,
    phone,
    address,
    road,
    subDistrict,
    district,
    province,
    postCode,
    bankAccount,
    idAccount
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
