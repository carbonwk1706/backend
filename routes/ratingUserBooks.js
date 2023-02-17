const express = require('express')
const router = express.Router()
const User = require('../models/user')

const getUserRatedBooks = async (req, res, next) => {
  const userId = req.params.userId
  const user = await User.findById(userId).populate('ratings.book')

  if (!user) {
    return res.status(404).send({
      message: 'User not found'
    })
  }

  const ratedBooks = user.ratings.map(rating => rating.book)

  res.status(200).send({
    ratedBooks
  })
}

router.get('/:userId', getUserRatedBooks)
module.exports = router
