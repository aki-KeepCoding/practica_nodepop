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
            next(err);
            return;
        }
        next(null, message);
        return;
    })
}


var Token = mongoose.model('Token', pushTokenSchema);



