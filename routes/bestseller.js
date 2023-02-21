const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const bestseller = async function (req, res, next) {
  const books = await Book.find().sort({ sold: -1 })
  res.json(books)
}

const bestsellerCartoon = async function (req, res, next) {
  const category = 'การ์ตูนทั่วไป'
  const bestsellers = await Book.find({ category }).sort({ sold: -1 })
  res.json(bestsellers)
}

const bestsellerNovel = async function (req, res, next) {
  const category = 'นิยาย'
  const bestsellers = await Book.find({ category }).sort({ sold: -1 })
  res.json(bestsellers)
}

router.get('/', bestseller)
router.get('/cartoon', bestsellerCartoon)
router.get('/novel', bestsellerNovel)
module.exports = router
