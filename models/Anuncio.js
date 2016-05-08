'use strict'

var async = require('async')
var mongoose = require('mongoose')

var anuncioSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [ {
    type: String,
    enum: [ 'work', 'lifestyle', 'motor', 'mobile' ]
  } ]
})

anuncioSchema.statics.clearAll = function (next) {
  Anuncio.remove({}, function (err) {
    if (err) {
      return next('Error al borrar Anuncios')
    }
    return next(null, 'Anuncios borrados')
  })
}

anuncioSchema.statics.search = function (options, criteria) {
  var qry = Anuncio.find(criteria)
  if (options.start) qry.skip(options.start)
  if (options.limit) qry.limit(options.limit)
  if (options.sort) qry.sort(options.sort)
  return qry.exec()
}

anuncioSchema.statics.listTags = function () {
  var qry = Anuncio.find().select('tags -_id')
  return qry.exec()
}

anuncioSchema.statics.saveAll = function (anuncioData, callback) {
  async.each(anuncioData, function (anuncioData, done) {
    var anuncio = new Anuncio(anuncioData)
    anuncio.save(function (err, newAnuncio) {
      if (err) return done(err)
      console.log(`Anuncio ${newAnuncio.nombre} guardado en BD`)
      return done()
    })
  }, function (err) {
    callback(err, 'Anuncios Guardados')
  })
}

anuncioSchema.statics.list = function () {
  var qry = Anuncio.find()
  return qry.exec()
}

var Anuncio = module.exports = mongoose.model('Anuncio', anuncioSchema)
