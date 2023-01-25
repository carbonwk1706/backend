const express = require('express')
const multer = require('multer')
const router = express.Router()
const User = require('../models/User')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + 'image' + file.originalname)
  }
})

let upload = multer({ dest: 'uploads/' })
upload = multer({ storage })

router.post('/', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const user = await User.findOneAndUpdate({ username: req.body.username }, { $set: { imageUrl } }, { new: true })
    res.json(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
