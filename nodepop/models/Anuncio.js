'use strict';

var async = require('async');
var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({ 
    nombre: String, 
    venta: Boolean, 
    precio: Number, 
    foto: String, 
    tags: [String] 
});

anuncioSchema.statics.clearAll = function(next){
    Anuncio.remove({}, function(err, message){
        if(err){
            next("Error al borrar Anuncios");
            return;
        }
        next(null, "Anuncios borrados");
        return;
    })
}

anuncioSchema.statics.saveAll = function(anuncioData, callback){
    async.each(anuncioData, function(anuncioData, callback){
        var anuncio = new Anuncio(anuncioData);
        anuncio.save(function(err, newAnuncio){
            if (err){
                callback(err);
                return;
            }
            console.log(`Anuncio ${newAnuncio.nombre} guardado en BD`);
            callback();
            return;
        })
    }, function(err){
        callback(err, 'Anuncios Guardados');
    })
}

var Anuncio = mongoose.model('Anuncio', anuncioSchema);



