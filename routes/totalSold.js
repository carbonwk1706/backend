const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const totalSold = async function (req, res) {
  try {
    const result = await Book.aggregate([
      {
        $group: {
          _id: null,
          totalSold: { $sum: '$sold' },
          totalRevenue: { $sum: { $multiply: ['$sold', '$price'] } }
        }
      }
    ])

    const { totalSold, totalRevenue } = result[0] || { totalSold: 0, totalRevenue: 0 }
    res.status(200).json({ totalSold, totalRevenue })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

router.get('/', totalSold)
module.exports = router
