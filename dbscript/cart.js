const mongoose = require('mongoose')
const Cart = require('../models/Cart')
mongoose.set('strictQuery', false)
mongoose.connect('mongodb://localhost:27017/Project_intern', { useNewUrlParser: true })
async function clearCart () {
  await Cart.deleteMany({})
}

async function main () {
  await clearCart()
  const cartList = new Cart({
    user: '63d0618ec6891a5004608c81',
    book: '63cf60b325eab217b4c5b60a'
  })

  await cartList.save()
}

main().then(() => {
  console.log('Finish')
})
