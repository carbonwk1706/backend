const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { authenMiddleware, authorizeMiddleware } = require('./helpers/auth')
const { ROLE } = require('./constant')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const uploadRouter = require('./routes/upload')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const booksRouter = require('./routes/books')
const confirmPasswordRouter = require('./routes/confirmPassword')
const checkRoles = require('./routes/checkRoles')
const checkRequestRoles = require('./routes/checkRequestRoles')
const wishList = require('./routes/wishlist')
const cart = require('./routes/cart')
const checkDuplicateUser = require('./routes/checkDuplicateUser')

mongoose.set('strictQuery', false)
dotenv.config()
mongoose.connect('mongodb://localhost:27017/Project_intern')
const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN]), usersRouter)
app.use('/auth', authRouter)
app.use('/upload', express.static('/uploads'), authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), uploadRouter)
app.get('/uploads/:filename', (req, res) => {
  const options = {
    root: path.join(__dirname, 'uploads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  }
  const fileName = req.params.filename
  res.sendFile(fileName, options, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Sent:', fileName)
    }
  })
}, authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]))
app.use('/profile', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), profileRouter)
app.use('/request', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), requestRouter)
app.use('/books', booksRouter)
app.use('/confirmPassword', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), confirmPasswordRouter)
app.use('/checkRoles', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), checkRoles)
app.use('/checkRequestRoles', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), checkRequestRoles)
app.use('/wishlist', authenMiddleware, authorizeMiddleware([ROLE.ADMIN, ROLE.LOCAL_ADMIN, ROLE.USER, ROLE.SELL]), wishList)
app.use('/cart', cart)
app.use('/checkDuplicateUser',checkDuplicateUser)

module.exports = app
