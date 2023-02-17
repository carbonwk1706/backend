const express = require('express')
const router = express.Router()
const Bestseller = require('../models/Bestseller')

const bestseller = async function (req, res, next) {
  const bestsellers = await Bestseller.find().sort({ count: -1 })
  res.json(bestsellers)
}

router.get('/', bestseller)
module.exports = router
