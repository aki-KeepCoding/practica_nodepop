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
    async.each(anuncioData, function(anuncioData, cb){
        var anuncio = new Anuncio(anuncioData);
        anuncio.save(function(err, newAnuncio){
            if (err){
                cb(err);
                return;
            }
            console.log(`Anuncio ${newAnuncio.nombre} guardado en BD`);
            cb();
            return;
        })
    }, function(err){
        callback(err, 'Anuncios Guardados');
    })
}

anuncioSchema.statics.list = function(){
    var qry = Anuncio.find();
    return qry.exec();
    // return new Promise(function (resolve, reject) {
    //     reject({error: "error provocado"});
    //     return;
    // })
};

var Anuncio = module.exports = mongoose.model('Anuncio', anuncioSchema);



