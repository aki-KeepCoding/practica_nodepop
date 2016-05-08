'use strict'

var usuariosData = [ {
  'nombre': 'Akixe Otegi',
  'email': 'akixe.otegi@gmail.com',
  'clave': '1234'
}, {
  'nombre': 'Juan Nadie',
  'email': 'j.nadie@example.org',
  'clave': '4321'
} ]

var anunciosData = [ {
  'nombre': 'Bicicleta',
  'venta': true,
  'precio': 230.15,
  'foto': 'bici.jpg',
  'tags': [ 'lifestyle', 'motor' ]
}, {
  'nombre': 'iPhone 3GS',
  'venta': false,
  'precio': 50.00,
  'foto': 'iphone.png',
  'tags': [ 'lifestyle', 'mobile' ]
} ]

var tokensData = [
  {
    'plataforma': 'ios',
    'token': '00000000',
    'usuario': 'Akixe Otegi'
  }, {
    'plataforma': 'ios',
    'token': '00000001',
    'usuario': 'Juan Nadie'
  }
]

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
async.series([
  Anuncio.clearAll, Usuario.clearAll, Token.clearAll,
  encryptUserPass, loadNewData],
  function (err, results) {
    mongoose.disconnect()
    if (err) return console.error('error', err)
    return console.log('resultado', results)
  }
)

function encryptUserPass (callback) {
  return async.map(usuariosData, Usuario.encryptClave, callback)
}

function loadNewData (callback) {
  // Ejecutamos el guardado de datos en paralelo mediante async.parallel
  //  https://github.com/caolan/async#paralleltasks-callback
  async.parallel([
    function (cb) {
      Usuario.saveAll(usuariosData, cb)
    },
    function (cb) {
      Anuncio.saveAll(anunciosData, cb)
    },
    function (cb) {
      Token.saveAll(tokensData, cb)
    }
  ], function (err, results) {
    // Una vez acabadas las tareas...
    return callback(err, results)
  })
}
