const mongoose = require('mongoose')
const Book = require('../models/Book')
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/Project_intern', { useNewUrlParser: true })

async function main () {
  await clearBook()
  const book1 = new Book({ name: 'สะดุดรักยัยแฟนเช่า 26 - Kanojo, Okarishimasu', author: 'Reiji Miyajima', publisher: 'LUCKPIM Publishing', category: 'การ์ตูนทั่วไป', price: 65, imageBook: 'https://cdn-local.mebmarket.com/meb/server1/225386/Thumbnail/web_large2.gif?2' })
  await book1.save()
  const book2 = new Book({ name: 'สะดุดรักยัยแฟนเช่า 1 - Kanojo, Okarishimasu', author: 'Reiji Miyajima', publisher: 'LUCKPIM Publishing', category: 'การ์ตูนทั่วไป', price: 45, imageBook: 'https://cdn-local.mebmarket.com/meb/server1/97839/Thumbnail/book_detail_large.gif?3' })
  await book2.save()
  const book3 = new Book({ name: 'ชีวิตไม่ต้องเด่น ขอแค่เป็นเทพในเงา เล่ม 6', author: 'ไดสุเกะ ไอซาวะ', publisher: 'PHOENIX', category: 'การ์ตูนทั่วไป', price: 129, imageBook: 'https://cdn-local.mebmarket.com/meb/server1/225738/Thumbnail/book_detail_large.gif?2' })
  await book3.save()
  const book4 = new Book({ name: '48 million miles', author: 'The Shepherd', publisher: 'The Shepherd', category: 'นิยายรัก', price: 359, imageBook: 'https://cdn-local.mebmarket.com/meb/server1/224996/Thumbnail/book_detail_large.gif?15' })
  await book4.save()
  const book5 = new Book({ name: 'ปรักหักรัก', author: 'หมึกทิพย์', publisher: 'หมึกทิพย์', category: 'นิยายชีวิต/ดรามา', price: 129, imageBook: 'https://cdn-local.mebmarket.com/meb/server1/225428/Thumbnail/book_detail_large.gif?2' })
  await book5.save()
}

async function clearBook () {
  await Book.deleteMany({})
}

main().then(() => {
  console.log('Finish')
})
