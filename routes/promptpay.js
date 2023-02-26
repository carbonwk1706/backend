const express = require('express')
const router = express.Router()
const QRCode = require('qrcode')
const generatePayload = require('promptpay-qr')

const generateQR = async function (req, res, next) {
  const amount = req.body.amount
  const mobileNumber = '0629088919'
  const payload = generatePayload(mobileNumber, { amount })
  const option = {
    color: {
      dark: '#000',
      light: '#fff'
    }
  }
  QRCode.toDataURL(payload, option, (err, url) => {
    if (err) {
      console.log('generate fail')
      return res.status(400).json({
        RespCode: 400,
        RespMessage: 'bad : ' + err
      })
    } else {
      return res.status(200).json({
        RespCode: 200,
        RespMessage: 'good',
        Result: url
      })
    }
  })
}

router.post('/', generateQR)
module.exports = router
