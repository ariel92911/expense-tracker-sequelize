// routes/home.js
const express = require('express')
const router = express.Router()
//const Record = require('../models/record')

// 載入 model
const db = require('../models')
const Record = db.Record
const User = db.User

// 載入 auth middleware 裡的 authenticated 方法
const { authenticated } = require('../config/auth')

// 設定首頁路由
router.get('/', authenticated, (req, res) => {
  res.send('列出全部 Record')
  // Record.find({ userId: req.user._id }, (err, records) => {
  //   let totalAmount = 0
  //   for (let i = 0; i < records.length; i++) {
  //     totalAmount += records[i].amount

  //     switch (records[i].category) {
  //       case '家居物業':
  //         records[i].category = '<i class="fas fa-home fa-3x"></i>'
  //         break;
  //       case '交通出行':
  //         records[i].category = '<i class="fas fa-shuttle-van fa-3x"></i>'
  //         break;
  //       case '休閒娛樂':
  //         records[i].category = '<i class="fas fa-grin-beam fa-3x"></i>'
  //         break;
  //       case '餐飲食品':
  //         records[i].category = '<i class="fas fa-utensils fa-3x"></i>'
  //         break;
  //       case '其他':
  //         records[i].category = '<i class="fas fa-pen fa-3x"></i>'
  //         break;
  //       default:
  //         console.log('沒有此類別')
  //         break;
  //     }

  //   }
  //   if (err) return console.error(err)
  //   return res.render('index', { records, totalAmount })  // 將資料傳給 index 樣板
  // })
})

module.exports = router