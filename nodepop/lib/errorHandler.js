"use strict";

module.exports = function(err, req, res, next){
    //comprobamos que sea un error "nuestro"
    // (err tiene la propiedad lang y el literal)
    if (err.lang && err.literal){
        //cargamos el fichero de literales de error del idioma que nos han pasado
        var ERRORS = require('../errors.'+err.lang+'.json');
        // Devolvemos un JSON con el error
        res.json({success: false , message : ERRORS[err.literal], rawError: err});
        return;
    }
    //Si no es un error nuestro pasamos al siguiente Middleware
    next();
    return;
};