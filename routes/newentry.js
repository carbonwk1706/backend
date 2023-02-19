const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const newEntry = async function (req, res, next) {
  const books = await Book.find().sort({ createdAt: -1 })
  res.json(books)
}

const getNewEntryCartoon = async function (req, res, next) {
  const category = 'การ์ตูนทั่วไป'
  const books = await Book.find().find({ category }).sort({ createdAt: -1 })
  res.json(books)
}

const getNewEntryNovel = async function (req, res, next) {
  const category = 'นิยาย'
  const books = await Book.find().find({ category }).sort({ createdAt: -1 })
  res.json(books)
}

router.get('/', newEntry)
router.get('/category/cartoon', getNewEntryCartoon)
router.get('/category/novel', getNewEntryNovel)
module.exports = router
