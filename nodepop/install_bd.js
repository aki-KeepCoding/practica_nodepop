'use strict';

var mongoose = require('mongoose');
//DB Connection
require('./lib/connectMongoose');

//Models
require('./models/Anuncio');
var Anuncio = mongoose.model('Anuncio');



Anuncio.clearAll(function(err, message){
     console.log("ok?", err, message.ok);
});


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