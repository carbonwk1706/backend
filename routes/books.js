const express = require('express')
const router = express.Router()
const Book = require('../models/Book')
const User = require('../models/User')
const HistoryCRUDBook = require('../models/HistoryCRUDBook')
const DeletedBook = require('../models/DeletedBook')

const getBooks = async function (req, res, next) {
  try {
    const books = await Book.find({}).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getAllBooks = async function (req, res, next) {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 }).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getBooksCartoon = async function (req, res, next) {
  try {
    const category = 'การ์ตูนทั่วไป'
    const books = await Book.find({ category }).sort({ createdAt: -1 }).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getBooksNovel = async function (req, res, next) {
  try {
    const category = 'นิยาย'
    const books = await Book.find({ category }).sort({ createdAt: -1 }).exec()
    res.status(200).json(books)
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const getBook = async function (req, res, next) {
  const bookId = req.params.id
  try {
    const book = await Book.findById(bookId).exec()
    if (book === null) {
      return res.status(200).json({
        message: 'Book not found!!'
      })
    }
    res.json(book)
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

const addBooks = async function (req, res, next) {
  const newBook = new Book({
    name: req.body.name,
    author: req.body.author,
    publisher: req.body.publisher,
    category: req.body.category,
    price: req.body.price,
    imageBook: req.body.imageBook,
    pdf: req.body.pdf
  })
  try {
    await newBook.save()
    const adminId = req.body.adminId
    const admin = await User.findById(adminId).exec()
    const history = new HistoryCRUDBook({
      action: 'add',
      bookId: newBook._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUDBook.push(history)
    await admin.save()
    req.app.get('io').emit('update-book-create')
    res.status(201).json({
      newBook
    })
  } catch (err) {
    return res.status(500).send({
      message: err.message
    })
  }
}

const updateBook = async function (req, res, next) {
  const bookId = req.params.id
  try {
    const originalBook = await Book.findById(bookId).exec()
    const book = await Book.findById(bookId).exec()
    book.name = req.body.name
    book.author = req.body.author
    book.publisher = req.body.publisher
    book.category = req.body.category
    book.price = req.body.price
    book.imageBook = req.body.imageBook
    await book.save()
    const adminId = req.body.adminId
    const admin = await User.findById(adminId).exec()
    const history = new HistoryCRUDBook({
      action: 'update',
      bookId: book._id,
      adminId: admin._id,
      oldData: originalBook,
      newData: book
    })
    await history.save()
    admin.historyCRUDBook.push(history)
    await admin.save()
    const users = await User.find({})
    for (const user of users) {
      if (user.inventory.includes(bookId)) {
        const notification = JSON.stringify({
          type: 'หนังสือเรื่อง : ' + book.name + ' ของคุณถูกแก้ไขโดยผู้ดูแลระบบ',
          message: 'หนังสือของคุณถูกลบโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ',
          createdAt: new Date()
        })
        user.notifications.push(notification)
        await user.save()
      }
    }
    req.app.get('io').emit('update-book-edit', {
      book
    })
    return res.status(200).json({ book, history })
  } catch (err) {
    return res.status(404).send({ message: err.message })
  }
}

const updateImageNewData = async function (req, res) {
  const historyId = req.params.historyId
  const updatedHistory = await HistoryCRUDBook.findOneAndUpdate(
    { _id: historyId },
    { $set: { 'newData.imageBook': req.body.imageBook } },
    { new: true }
  ).exec()
  res.status(200).json({ history: updatedHistory })
}

const updatePDFNewData = async function (req, res) {
  const historyId = req.params.historyId
  const updatedHistory = await HistoryCRUDBook.findOneAndUpdate(
    { _id: historyId },
    { $set: { 'newData.pdf': req.body.pdf } },
    { new: true }
  ).exec()
  res.status(200).json({ history: updatedHistory })
}

const deleteBook = async function (req, res, next) {
  const bookId = req.params.id
  const adminId = req.params.adminId
  try {
    const book = await Book.findById(bookId).exec()
    if (book === null) {
      return res.status(404).json({
        message: 'Book not found!!'
      })
    }
    const deletedBook = { ...book._doc }
    await Book.findByIdAndDelete(book)
    const admin = await User.findById(adminId).exec()
    if (admin === null) {
      return res.status(404).json({
        message: 'Admin not found!!'
      })
    }
    const bookDeleted = new DeletedBook({
      bookId: deletedBook._id,
      pdf: deletedBook.pdf,
      name: deletedBook.name,
      author: deletedBook.author,
      publisher: deletedBook.publisher,
      category: deletedBook.category,
      price: deletedBook.price,
      imageBook: deletedBook.imageBook,
      createdAt: deletedBook.createdAt,
      rating: deletedBook.rating,
      ratingsCount: deletedBook.ratingsCount,
      sold: deletedBook.sold
    })
    await bookDeleted.save()
    const history = new HistoryCRUDBook({
      action: 'delete',
      bookId: deletedBook._id,
      adminId: admin._id
    })
    await history.save()
    admin.historyCRUDBook.push(history)
    await admin.save()
    const users = await User.find({})
    for (const user of users) {
      if (user.inventory.includes(bookId)) {
        const notification = JSON.stringify({
          type: 'หนังสือเรื่อง : ' + deletedBook.name + ' ของคุณถูกลบโดยผู้ดูแลระบบ',
          message: 'หนังสือของคุณถูกลบโดยผู้ดูแลระบบโปรดติดต่อผู้ดูแลระบบ',
          createdAt: new Date()
        })
        user.notifications.push(notification)
        await user.save()
      }
    }
    req.app.get('io').emit('update-book-delete', {
      bookDeleted
    })
    return res.status(200).send()
  } catch (err) {
    return res.status(404).send({
      message: err.message
    })
  }
}

router.get('/', getBooks)
router.get('/all', getAllBooks)
router.get('/cartoon', getBooksCartoon)
router.get('/novel', getBooksNovel)
router.get('/:id', getBook)
router.post('/', addBooks)
router.put('/:id', updateBook)
router.delete('/:id/:adminId', deleteBook)
router.patch('/updateImage/:historyId', updateImageNewData)
router.patch('/updatePdf/:historyId', updatePDFNewData)
module.exports = router
