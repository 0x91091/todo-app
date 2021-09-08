const express = require('express')
let bodyParser = require('body-parser')
const path = require('path')
const indexRouter = require('./routes/index')

const app = express()

app.use('/', express.static(path.resolve(__dirname, 'public')))
app.use(bodyParser.json())
app.use(indexRouter)

module.exports = app