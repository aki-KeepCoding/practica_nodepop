'use strict'

var usuariosData = require('./data/dummyData.json').usuarios
var anunciosData = require('./data/dummyData.json').anuncios
var tokensData = require('./data/dummyData.json').tokens

var async = require('async')
var mongoose = require('mongoose')

// Conectar a BD
require('./lib/connectMongoose')

// Inicializar Models
require('./models/Anuncio')
require('./models/Usuario')
require('./models/Token')

var Anuncio = mongoose.model('Anuncio')
var Usuario = mongoose.model('Usuario')
var Token = mongoose.model('Token')

// Ejecutamos el borrado secuencialmente: 1.Anuncios>>2.Usuario>>3.Tokens
// Usamos la librería [Async](https://github.com/caolan/async) para facilitar tarea
async.series([Anuncio.clearAll, Usuario.clearAll, Token.clearAll,
  loadNewData],
  function (err, results) {
    mongoose.disconnect()
    if (err) return console.error('error', err)
    return console.log('resultado', results)
  }
)

function loadNewData (callback) {
  // Ejecutamos el guardado de datos en paralelo mediante async.parallel
  //  https://github.com/caolan/async#paralleltasks-callback
  async.parallel([
    function (cb) {
      return Usuario.saveAll(usuariosData, cb)
    },
    function (cb) {
      return Anuncio.saveAll(anunciosData, cb)
    },
    function (cb) {
      return Token.saveAll(tokensData, cb)
    }
  ], function (err, results) {
    // Una vez acabadas las tareas...
    return callback(err, results)
  })
}
