const dotenv = require("dotenv")
dotenv.config()

let express = require('express')
let bodyParser = require('body-parser');
let path = require('path')
let logger = require('morgan')
let fileStreamRotator = require('file-stream-rotator')
let fs = require('fs')
let cors = require('cors')
let apiBaseUri = require('../api/apiNamespace').API_BASE_URI
const history = require('connect-history-api-fallback')

const moment = require('moment')

let _log = console.log

console.log = function(...info) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss")
  _log(`${now}: `, " vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv ")
  _log(`${now}: `, info)
  _log(`${now}: `, " ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ")
  _log("")
  _log("")
  _log("")
}

let _err = console.error

console.error = function(...info) {
  let now = moment().format("YYYY-MM-DD HH:mm:ss")
  _err(`${now}: `, " vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv ")
  _err(`${now}: `, info)
  _err(`${now}: `, " ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ")
  _err("")
  _err("")
  _err("")
}

let router = require('../router/routers')
let app = express()

let logDirectory = path.join(__dirname, '../log/web')

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream
let accessLogStream = fileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

app.use(logger('combined', {stream: accessLogStream}))

app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors())
app.use(express.json({"limit":"10mb"}));
app.use(express.urlencoded({ extended: false }))

let allRouters = [
  require("../api/echo"),
]

router.RouterRegister(app, allRouters)

app.use(express.static(path.join(__dirname, '../public')))
app.use(history())
app.use(express.static(path.join(__dirname, '../public')))

app.use(function(req, res) {
  if(apiBaseUri === req.originalUrl.substring(0, apiBaseUri.length)) {
    res.status(404)
      .json({Error: "404 - page not found"})
  } else {
    res.redirect(req.originalUrl)
  }
});

app.use((err, req, res, next) => {
  res.status(500)
  next()
})

require("../db/connection/connect")
module.exports = app
