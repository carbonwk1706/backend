const express = require('express')
const router = express.Router()
const DeletedUser = require('../models/DeletedUser')

const getUser = async function (req, res, next) {
  const userId = req.params.id
  try {
    const user = await DeletedUser.findOne({ userId }).exec()
    if (user === null) {
      return res.status(404).json({
        message: 'User not found!!'
      })
    }
    res.json(user)
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.get('/:id', getUser)
module.exports = router
