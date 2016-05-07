'use strict';

var async = require('async');
var mongoose = require('mongoose');

var anuncioSchema = mongoose.Schema({ 
    nombre: String, 
    venta: Boolean,
    precio: Number, 
    foto: String, 
    tags: [{
        type: String,
        enum: ['work', 'lifestyle', 'motor', 'mobile']
    }]
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


/*
 Parámetros:

 Options: {
    start: Number > Paginación, inicio
    limit: Number > Paginación, límite
    sort: String > Criterio de ordenación. p.ej = 'field2 -field2' (ordena ascendente field1 y descendente field2)
 },
 query: Objeto de Criterios de búsqueda. p.ej:
 {
    venta: true,
    precio: { $grt}
 }

 */
anuncioSchema.statics.search = function(options, criteria){
    var qry = Anuncio.find(criteria);
    if (options.start) qry.skip(options.start);
    if (options.limit) qry.limit(options.limit);
    if (options.sort) qry.sort(options.sort);
    return qry.exec()
};


anuncioSchema.statics.listTags = function(){
    var qry = Anuncio.find().select('tags -_id');
    return qry.exec();
};




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



