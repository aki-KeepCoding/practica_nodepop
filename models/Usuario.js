'use strict'

var async = require('async')
var config = require('../config/general')
var bcrypt = require('bcrypt')
const saltRounds = 10

var mongoose = require('mongoose')

/*
 * nombre : Texto
 * email : único, en minúsculas
 * clave:
 * */
var usuarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  clave: {
    type: String,
    required: true
  }
})

/*
 * (i) Antes de guardar encryptamos siempre la clave
 * +info en [Mongoose Middleware](http://mongoosejs.com/docs/middleware.html)
 */
usuarioSchema.pre('save', function (next) {
  // (i) Instancia de usuario que estamos crando
  var usuario = this

  if (this.isModified('clave') || this.isNew) {
    // si el usuario es nuevo o se ha modificado la clave
    // (i) isModified e isNew son métodos de Mongoose que determinan si es un documento modificado o nuevo

    // GENERAR HASH con bcrypt
    bcrypt.genSalt(config.rounds, function (err, salt) {
      if (err) return next(new Error(err))
      bcrypt.hash(usuario.clave, salt, function (err, hash) {
        if (err) next(err)
        usuario.clave = hash
        return next()
      })
    })
  } else {
    // (i) Se está modificando otro dato del usuario
    return next()
  }
})

/*
 * # Método de instancia comapraClave
 * - Recibe una clabe y compara contra la instancia de usuario
 * - Usa bcrypt.compare
 */
usuarioSchema.methods.comparaClave = function (clave, callback) {
  bcrypt.compare(clave, this.clave, function (err, match) {
    if (err) return callback(err)
    callback(null, match)
  })
}

// usuarioSchema.statics.encryptClave = function (usuario, callback) {
//   if (usuario.clave) {
//     bcrypt.genSalt(saltRounds, function (err, salt) {
//       if (err) return callback(err)
//       bcrypt.hash(usuario.clave, salt, function (err, hash) {
//         if (err) return callback(err)
//         usuario.clave = hash
//         return callback(null, usuario)
//       })
//     })
//   }
// }

usuarioSchema.statics.clearAll = function (next) {
  Usuario.remove({}, function (err) {
    if (err) return next(err)
    return next(null, 'Usuarios borrados')
  })
}
usuarioSchema.statics.saveAll = function (usuariosData, callback) {
  async.each(usuariosData, function (usuarioData, done) {
    var usuario = new Usuario(usuarioData)
    usuario.save(function (err, newUsuario) {
      if (err) return done(new Error(err))
      console.log(`Usuario ${newUsuario.nombre} guardado en BD`)
      return done()
    })
  }, function (err) {
    callback(err, 'Usuarios Guardados')
  })
}

usuarioSchema.statics.list = function () {
  var qry = Usuario.find()
  return qry.exec()
}

var Usuario = module.exports = mongoose.model('Usuario', usuarioSchema)
