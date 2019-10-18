// routes/record.js
const express = require('express')
const router = express.Router()

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
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.findAll({
        where: { UserId: req.user.id }
      })
    })
    //篩選類別
    .then((records) => {
      if (req.query.type !== '類別' && req.query.type !== 'All') {
        return Record.findAll({
          where: { category: req.query.type }
        })
      } else {
        return Record.findAll({
          where: { UserId: req.user.id }
        })
      }
    })
    //篩選月份
    .then((records) => {
      let selectedRecords = []

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
        return selectedRecords
      } else {
        return records
      }
    })
    .then((records) => {
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

      //計算支出金額
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount

        switch (records[i].category) {
          case '家居物業':
            records[i].category = '<i class="fas fa-home fa-3x"></i>'
            break;
          case '交通出行':
            records[i].category = '<i class="fas fa-shuttle-van fa-3x"></i>'
            break;
          case '休閒娛樂':
            records[i].category = '<i class="fas fa-grin-beam fa-3x"></i>'
            break;
          case '餐飲食品':
            records[i].category = '<i class="fas fa-utensils fa-3x"></i>'
            break;
          case '其他':
            records[i].category = '<i class="fas fa-pen fa-3x"></i>'
            break;
          default:
            console.log('沒有此類別')
            break;
        }
      }

      return res.render('index', { records, totalAmount, monthOption, typeOption })
    })
    .catch((error) => { return res.status(422).json(error) })
})

// 新增一筆 record 頁面
router.get('/new', authenticated, (req, res) => {
  return res.render('new')
})

// 新增一筆  record 動作
router.post('/', authenticated, (req, res) => {
  Record.create({
    name: req.body.name,
    merchant: req.body.merchant,
    category: req.body.category,
    date: req.body.date,
    amount: req.body.amount,
    UserId: req.user.id
  })
    .then((record) => {
      return res.redirect('/')
    })
    .catch((error) => { return res.status(422).json(error) })

})

// 修改 record 頁面
router.get('/:id/edit', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id,
        }
      })
    })
    .then((record) => {
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

      return res.render('edit', { record, categoryFor })
    })

})

// 修改 record 動作
router.post('/:id/edit', authenticated, (req, res) => {
  Record.findOne({
    where: {
      Id: req.params.id,
      UserId: req.user.id,
    }
  })
    .then((record) => {
      record.name = req.body.name
      record.merchant = req.body.merchant
      record.category = req.body.category
      record.date = req.body.date
      record.amount = req.body.amount

      return record.save()
    })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})

// 刪除 record 動作
router.post('/:id/delete', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      })
    })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router