// routes/record.js
const express = require('express')
const router = express.Router()
//const Record = require('../models/record')

// 載入 model
const db = require('../models')
const Record = db.Record
const User = db.User

// 載入 auth middleware
const { authenticated } = require('../config/auth')

// 設定 /records 路由
// 列出全部 record
router.get('/', authenticated, (req, res) => {
  return res.redirect('/')
})

// 列出特定類別 record
router.get('/category', authenticated, (req, res) => {

  //記住篩選月份
  let monthOption = {}
  switch (req.query.month) {
    case '01月':
      monthOption['Jan'] = true
      break;
    case '02月':
      monthOption['Feb'] = true
      break;
    case '03月':
      monthOption['Mar'] = true
      break;
    case '04月':
      monthOption['Apr'] = true
      break;
    case '05月':
      monthOption['May'] = true
      break;
    case '06月':
      monthOption['Jun'] = true
      break;
    case '07月':
      monthOption['Jul'] = true
      break;
    case '08月':
      monthOption['Aug'] = true
      break;
    case '09月':
      monthOption['Sep'] = true
      break;
    case '10月':
      monthOption['Oct'] = true
      break;
    case '11月':
      monthOption['Nov'] = true
      break;
    case '12月':
      monthOption['Dec'] = true
      break;
    case 'All':
      monthOption['All'] = true
      break;
  }

  //記住篩選類別
  let typeOption = {}
  switch (req.query.type) {
    case '家居物業':
      typeOption['Home'] = true
      break;
    case '交通出行':
      typeOption['Traffic'] = true
      break;
    case '休閒娛樂':
      typeOption['Fun'] = true
      break;
    case '餐飲食品':
      typeOption['Food'] = true
      break;
    case '其他':
      typeOption['Other'] = true
      break;
    case 'All':
      typeOption['All'] = true
      break;
  }

  //預設篩選條件
  let filter = { userId: req.user._id }

  //判斷是否增加篩選條件-支出類別
  if (req.query.type !== '類別' && req.query.type !== 'All') {
    filter['category'] = req.query.type
  }

  Record.find(filter, (err, records) => {

    let selectedRecords = []

    //判斷有無指定篩選條件-支出月份
    if (req.query.month !== '月份' && req.query.month !== 'All') {

      //篩選出與指定月份相符的資料
      for (let i = 0; i < records.length; i++) {
        let dataSplit = records[i].date.split('-')
        let selectedMonth = dataSplit[1] + '月'

        //將資料丟進新陣列中
        if (selectedMonth === req.query.month) {
          selectedRecords.push(records[i])
        }
      }
    } else {
      selectedRecords = records
    }

    let totalAmount = 0
    for (let i = 0; i < selectedRecords.length; i++) {
      totalAmount += selectedRecords[i].amount

      switch (selectedRecords[i].category) {
        case '家居物業':
          selectedRecords[i].category = '<i class="fas fa-home fa-3x"></i>'
          break;
        case '交通出行':
          selectedRecords[i].category = '<i class="fas fa-shuttle-van fa-3x"></i>'
          break;
        case '休閒娛樂':
          selectedRecords[i].category = '<i class="fas fa-grin-beam fa-3x"></i>'
          break;
        case '餐飲食品':
          selectedRecords[i].category = '<i class="fas fa-utensils fa-3x"></i>'
          break;
        case '其他':
          selectedRecords[i].category = '<i class="fas fa-pen fa-3x"></i>'
          break;
        default:
          console.log('沒有此類別')
          break;
      }
    }
    if (err) return console.error(err)
    return res.render('index', { records: selectedRecords, totalAmount, monthOption, typeOption })  // 將資料傳給 index 樣板
  })
})

// 新增一筆 record 頁面
router.get('/new', authenticated, (req, res) => {
  return res.render('new')
})

// 新增一筆  record 動作
router.post('/', authenticated, (req, res) => {
  const record = new Record({
    name: req.body.name,
    merchant: req.body.merchant,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    // 儲存 userId
    userId: req.user._id
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})

// 修改 record 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    let categoryFor = {}
    switch (record.category) {
      case '家居物業':
        categoryFor['Home'] = true
        break;
      case '交通出行':
        categoryFor['Traffic'] = true
        break;
      case '休閒娛樂':
        categoryFor['Fun'] = true
        break;
      case '餐飲食品':
        categoryFor['Food'] = true
        break;
      case '其他':
        categoryFor['Other'] = true
        break;
    }
    if (err) return console.error(err)
    return res.render('edit', { record, categoryFor })
  })
})

// 修改 record 動作
router.post('/:id/edit', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.name = req.body.name,
      record.merchant = req.body.merchant,
      record.category = req.body.category,
      record.date = req.body.date,
      record.amount = req.body.amount,
      record.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
      })
  })
})

// 刪除 record 動作
router.post('/:id/delete', authenticated, (req, res) => {
  Record.findOne({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router