const express = require('express')
const multer = require('multer')
const router = express.Router()
const User = require('../models/User')
const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('image'), async (req, res) => {
  // Save the image to the file system
  // ... (implementation depends on storage service)

  // Get the URL of the image
  const imageUrl = `/uploads/${req.file.filename}`

  // Add the image URL to the user's information
  try {
    const user = await User.findOneAndUpdate({ username: req.body.username }, { $set: { imageUrl } }, { new: true })
    res.json(user)
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
