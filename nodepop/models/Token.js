'use strict';

var async = require('async');
var mongoose = require('mongoose');

var pushTokenSchema = mongoose.Schema({ 
    plataforma: {
        type: String, 
        enum: ['ios', 'android']}, 
        token: String, 
        usuario: String 
})


pushTokenSchema.statics.saveAll = function(tokensData, callback){
    async.each(tokensData, function(tokenData, callback){
        var token = new Token(tokenData);
        token.save(function(err, newToken){
            if (err){
                callback(err);
                return;
            }
            console.log(`Token ${newToken.token} guardado en BD`);
            callback();
            return;
        })
    }, function(err){
        callback(err, 'Tokens Guardados');
    })
}

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



