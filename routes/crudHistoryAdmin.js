const express = require('express')
const router = express.Router()
const User = require('../models/User')
const HistoryCRUD = require('../models/historyCRUD')

const getHistoryCRUD = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const AdminHistoryCRUD = await HistoryCRUD.find({
      _id: { $in: user.historyCRUD }
    }).sort({ createdAt: -1 })
    res.send({ AdminHistoryCRUD })
  } catch (error) {

  }
}

router.get('/all/:id', getHistoryCRUD)
module.exports = router
