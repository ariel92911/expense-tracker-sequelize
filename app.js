// app.js

const express = require('express')
const app = express()
const port = 3000
const db = require('./models')

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
//const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('passport')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
//app.use(methodOverride('_method'))

app.use(session({
  secret: 'my secret key',
  resave: false,
  saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

app.use((req, res, next) => {
  res.locals.user = req.user
  //res.locals.isAuthenticated = req.isAuthenticated()
  next()
})


// 載入路由器
app.use('/', require('./routes/home'))
app.use('/records', require('./routes/record'))
app.use('/users', require('./routes/user'))


// 設定 express port 3000
app.listen(port, () => {
  console.log(`App is running on port ${port}!`)
})