const express = require('express')
const router = express.Router()
const Request = require('../models/Request')

const checkRequestRoles = async function (req, res, next) {
  const id = req.params.id
  try {
    const request = await Request.find({ user: id })
    res.send({ request })
  } catch (error) {
    res.status(404).send(error)
  }
}

router.get('/:id', checkRequestRoles)
module.exports = router
