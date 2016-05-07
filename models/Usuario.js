'use strict';

var config = require('../config/general');
var async = require('async');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var mongoose = require('mongoose');


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
        required:true
    }
});


/*
* Antes de guardar encryptamos siempre la clave
* +info en [Mongoose Middleware](http://mongoosejs.com/docs/middleware.html)
 */
usuarioSchema.pre('save', function (next) {
    var usuario = this; //instancia de usuario que estamos crando

    if (this.isModified('clave') || this.isNew) { //si el usuario es nuevo o se ha modificado la clave
        // isModified e isNew son métodos de Mongoose que determinan si es un documento modificado o nuevo

        //GENERAR HASH
        bcrypt.genSalt(config.rounds, function (err, salt) {
            if(err) return next(err);
            bcrypt.hash(usuario.clave, salt, function(err, hash){
                if(err) next(err);
                usuario.clave = hash;
                next();
            })
        })
    } else { // Se está modificando otro dato del usuario
        return next();
    }
});

/*
* # Método de instancia comapraClave
* - Recibe una clabe y compara contra la instancia de usuario
* - Usa bcrypt.compare
*/
usuarioSchema.methods.comparaClave = function(clave, callback){
    bcrypt.compare(clave, this.clave, function(err, match){
        if(err) return callback(err);
        callback(null, match);
    })
};





//Todo : a borrar. Obsoleto...modificar install_bd
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

var Usuario = module.exports = mongoose.model('Usuario', usuarioSchema);





