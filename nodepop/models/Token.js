'use strict';

var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({ 
    plataforma: {
        type: String, 
        enum: ['ios', 'android']}, 
        token: String, 
        usuario: String 
})

pushTokenSchema.statics.clearAll = function(next){
    Token.remove({}, function(err, message){
        if(err){
            next("Error al borrar Tokens");
            return;
        }
        next(null, "Tokens borrados");
        return;
    })
}


var Token = mongoose.model('Token', pushTokenSchema);



