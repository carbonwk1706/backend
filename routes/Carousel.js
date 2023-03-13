const express = require('express')
const router = express.Router()
const Carousel = require('../models/CarouselImage')

const getCarousel = async function (req, res) {
  try {
    const carousels = await Carousel.find().exec()
    res.status(200).json({ carousels })
  } catch (error) {
    res.status(500).send(error)
  }
}

const deleteCarousel = async function (req, res) {
  try {
    const carousel = await Carousel.findByIdAndDelete(req.params.id)
    if (!carousel) {
      return res.status(404).send('Carousel image not found.')
    }
    req.app.get('io').emit('delete-image-carousel')
    res.status(200).json({ message: 'Carousel image deleted successfully.' })
  } catch (error) {
    res.status(500).send(error)
  }
}

router.get('/', getCarousel)
router.delete('/:id', deleteCarousel)
module.exports = router
