'use strict'

var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = express()

require('./lib/connectMongoose')
require('./models/Anuncio')
require('./models/Usuario')
require('./models/Token')
var anuncios = require('./routes/api/v1/anuncios')
var usuarios = require('./routes/api/v1/usuarios')
var tokens = require('./routes/api/v1/tokens')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// PASSPORT
var passport = require('passport')
app.use(passport.initialize())
require('./lib/passport_jwt')(passport)

// RUTAS
app.use('/api/v1/anuncios', anuncios)
app.use('/api/v1/usuarios', usuarios)
app.use('/api/v1/tokens', tokens)

// CATCH 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// ERROR handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
