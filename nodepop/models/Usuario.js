'use strict';

var async = require('async');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose');

var usuarioSchema = mongoose.Schema({ 
    nombre: String, 
    email: String, 
    clave: String 
})

usuarioSchema.statics.clearAll = function(next){
    Usuario.remove({}, function(err, message){
        if(err){
            next("Error al borrar Usuarios");
            return;
        }
        next(null, "Usuarios borrados");
        return;
    })
}

usuarioSchema.statics.saveAll = function(usuariosData, callback){
    async.each(usuariosData, function(usuarioData, cb){
        var usuario = new Usuario(usuarioData);
        usuario.save(function(err, newUsuario){
            if (err){
                cb(err);
                return;
            }
            console.log(`Usuario ${newUsuario.nombre} guardado en BD`);
            cb();
            return;
        })
    }, function(err){
        callback(err, 'Usuarios Guardados');
    })
};

usuarioSchema.statics.encryptClave = function(usuario, callback){
    if(usuario.clave){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err){
                callback(err);
                return null;
            }
            bcrypt.hash(usuario.clave, salt, function(err, hash) {
                if (err){
                    callback(err);
                    return null;
                }
                usuario.clave = hash;
                callback(null, usuario);
                return;
            });
        });    
    }
};

usuarioSchema.statics.list = function (req,res,next) {
    var qry = Usuario.find();
    return qry.exec();
}

var Usuario = mongoose.model('Usuario', usuarioSchema);





