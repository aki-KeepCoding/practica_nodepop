'use strict'

var async = require('async')
var mongoose = require('mongoose')
var Usuario = mongoose.model('Usuario')

var pushTokenSchema = mongoose.Schema({
  plataforma: {
    type: String,
    required: true,
    enum: [ 'ios', 'android' ]
  },
  token: {
    type: String,
    required: true
  },
  usuario: {
    type: String
  }
})

// Custom validation
// Comprobamos que el usuario exista antes de asignarlo al token
pushTokenSchema.path('usuario').validate(function (value, respond) {
  if (!value) respond(true)
  Usuario.findOne({ _id: value }, function (err, doc) {
    if (err || !doc) {
      respond(false)
    } else {
      respond(true)
    }
  })
}, 'NON_EXISTENT_USER_ID')

pushTokenSchema.statics.saveAll = function (tokensData, callback) {
  async.each(tokensData, function (tokenData, done) {
    var token = new Token(tokenData)
    token.save(function (err, newToken) {
      if (err) return done(err)
      console.log(`Token ${newToken.token} guardado en BD`)
      return done()
    })
  }, function (err) {
    callback(err, 'Tokens Guardados')
  })
}

pushTokenSchema.statics.clearAll = function (next) {
  Token.remove({}, function (err) {
    if (err) return next(err)
    return next(null, 'Tokens borrados')
  })
}

var Token = mongoose.model('Token', pushTokenSchema)
