const express = require('express')
const multer = require('multer')
const router = express.Router()
const User = require('../models/User')
const Receipt = require('../models/Receipt')
const Request = require('../models/Request')
const Book = require('../models/Book')
const RequestBook = require('../models/RequestBook')
const Carousel = require('../models/CarouselImage')

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

router.post('/slip/:id', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageSlip = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, { $set: { imageSlip } }, { new: true })
    res.json(receipt)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/imageIDCard/:id', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageIDCard = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { $set: { imageIDCard } }, { new: true })
    res.json(request)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/imageBankAccount/:id', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageBankAccount = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { $set: { imageBankAccount } }, { new: true })
    res.json(request)
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/requestpdf/:id', upload.single('pdf'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const pdf = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const request = await RequestBook.findByIdAndUpdate(req.params.id, { $set: { pdf } }, { new: true })
    req.app.get('io').emit('request-upload-pdf-book')
    res.status(200).json({ request })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/requestimageBook/:id', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageBook = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const request = await RequestBook.findByIdAndUpdate(req.params.id, { $set: { imageBook } }, { new: true })
    req.app.get('io').emit('request-upload-image-book')
    res.status(200).json({ request })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/pdf/:id', upload.single('pdf'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const pdf = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { $set: { pdf } }, { new: true })
    req.app.get('io').emit('upload-pdf-book')
    res.status(200).json({ book })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/imageBook/:id', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageBook = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, { $set: { imageBook } }, { new: true })
    req.app.get('io').emit('upload-image-book')
    res.status(200).json({ book })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/carousel', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const image = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const carousel = new Carousel({
      imageURL: image
    })
    await carousel.save()
    req.app.get('io').emit('upload-image-carousel')
    res.status(200).json({ carousel })
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/carousel/:id', upload.single('image'), async (req, res) => {
  const host = req.headers.host
  const protocol = req.protocol

  const imageURL = `${protocol}://${host}/uploads/${req.file.filename}`

  try {
    const carousel = await Carousel.findByIdAndUpdate(req.params.id, { $set: { imageURL } }, { new: true })
    req.app.get('io').emit('edit-image-carousel')
    res.status(200).json({ carousel })
  } catch (error) {
    res.status(500).send(error)
  }
})
module.exports = router
