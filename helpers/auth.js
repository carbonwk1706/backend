const jwt = require('jsonwebtoken')
const generateAccessToken = function (user) {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '1d' })
}

// Middleware
const authenMiddleware = function (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token === null) return res.sendStatus(401)
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, user) {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    console.log(user)
    next()
  })
}
module.exports = {
  generateAccessToken,
  authenMiddleware
}
