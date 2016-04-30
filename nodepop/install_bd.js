'use strict';

var mongoose = require('mongoose');
//DB Connection
require('./lib/connectMongoose');

//Models
require('./models/Anuncio');
var Anuncio = mongoose.model('Anuncio');
require('./models/Usuario');
var Usuario = mongoose.model('Usuario');

require('./models/Token');
var Token = mongoose.model('Token');



Anuncio.clearAll(function(err, message){
    if(err){
        console.log("err", err);
        return;
    }
    console.log("Anuncios borrados");
    return;
});

Usuario.clearAll(function(err, message){
    if(err){
        console.log("err", err);
        return;
    }
    console.log("Usuarios borrados");
    return;
})

Token.clearAll(function(err, message){
    if(err){
        console.log("err", err);
        return;
    }
    console.log("Tokens borrados");
    return;
})



//borrar Anuncios
    //  borrar usuarios
        // borrar tokens


// { "anuncios": [ { 
//         "nombre": "Bicicleta", 
//         "venta": true, 
//         "precio": 230.15, 
//         "foto": "bici.jpg", 
//         "tags": [ "lifestyle", "motor"]
//     }, { 
//         "nombre": "iPhone 3GS", 
//         "venta": false, 
//         "precio": 50.00, 
//         "foto": "iphone.png", 
//         "tags": [ "lifestyle", "mobile"] 
//     }] 
// }