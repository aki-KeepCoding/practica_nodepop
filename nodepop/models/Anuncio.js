'use strict';

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
            next(err);
            return;
        }
        next(null, message);
        return;
    })
}


var Anuncio = mongoose.model('Anuncio', anuncioSchema);



