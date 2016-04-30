'use strict';

var async = require('async');
var mongoose = require('mongoose');

//Conectar a BD
require('./lib/connectMongoose');

//Inicializar Models
require('./models/Anuncio');
var Anuncio = mongoose.model('Anuncio');
require('./models/Usuario');
var Usuario = mongoose.model('Usuario');
require('./models/Token');
var Token = mongoose.model('Token');


//Ejecutamos el borrado secuencialmente: 1.Anuncios>>2.Usuario>>3.Tokens
//Usamos la librería [Async](https://github.com/caolan/async) para facilitar tarea
async.series([
        Anuncio.clearAll,
        Usuario.clearAll,
        Token.clearAll
    ],
    // optional callback
    function(err, results){
        mongoose.disconnect(function(){
            console.log("Disconnected from MongoDB");
        });
        if(err){
            console.error('error', err);
            return;
        }
        console.log("resultado", results);
        return;
    }
);