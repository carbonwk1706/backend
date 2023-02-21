const express = require('express')
const router = express.Router()
const Book = require('../models/Book')

const newEntry7day = async function (req, res, next) {
  const books = await Book.find().sort({ createdAt: -1 })
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const newBooks = books.filter(book => book.createdAt >= sevenDaysAgo)
  res.json(newBooks)
}

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
router.get('/cartoon', getNewEntryCartoon)
router.get('/novel', getNewEntryNovel)
router.get('/new', newEntry7day)
module.exports = router
