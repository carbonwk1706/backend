const jwt = require('jsonwebtoken')
const User = require('../models/User')
const generateAccessToken = function (user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1d' })
}

// Middleware
const authenMiddleware = function (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) return res.sendStatus(401)
  jwt.verify(token, process.env.TOKEN_SECRET, async function (err, user) {
    if (err) return res.sendStatus(403)
    const currentUser = await User.findById(user._id).exec()
    req.user = currentUser
    next()
  })
}

const authorizeMiddleware = function (roles) {
  return function (req, res, next) {
    for (let i = 0; i < roles.length; i++) {
      if (req.user.roles.indexOf(roles[i]) >= 0) {
        next()
        return
      }
    }
    res.sendStatus(401)
  }
}
module.exports = {
  generateAccessToken,
  authenMiddleware,
  authorizeMiddleware
}
