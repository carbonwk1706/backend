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

const getHistoryCreate = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const AdminHistoryCRUD = await HistoryCRUD.find({
      _id: { $in: user.historyCRUD },
      action: 'add'
    }).sort({ createdAt: -1 })
    res.send({ AdminHistoryCRUD })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const getHistoryUpdate = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const AdminHistoryCRUD = await HistoryCRUD.find({
      _id: { $in: user.historyCRUD },
      action: 'update'
    }).sort({ createdAt: -1 })
    res.send({ AdminHistoryCRUD })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

const getHistoryDelete = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    if (!user) return res.status(404).send('User not found')
    const AdminHistoryCRUD = await HistoryCRUD.find({
      _id: { $in: user.historyCRUD },
      action: 'delete'
    }).sort({ createdAt: -1 })
    res.send({ AdminHistoryCRUD })
  } catch (error) {
    return res.status(500).send({
      message: error.message
    })
  }
}

router.get('/all/:id', getHistoryCRUD)
router.get('/create/:id', getHistoryCreate)
router.get('/update/:id', getHistoryUpdate)
router.get('/delete/:id', getHistoryDelete)
module.exports = router
