"use strict";
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var config = require('../config/general');


//inyectamos la dependencia de la librería passport
module.exports = function(passport){
    //configuramos passport-jwt
    var opts = {};
    //opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');
    opts.secretOrKey = config.secret;

    //añadimos nueva estrategia de autenticación a Passport
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        //Búsqueda de usuario en bd por el id
        //en el payload JWT nos llegarán los datos del usuario que es lo que
        //hemos guardado previamente cuando hemos generado la key
        Usuario.findOne({_id: jwtPayload.id}, function (err, usuario) {
            if(err) return done(err, false);//error en la bd, devolvemos false (y error)
            if(usuario) {
                done(null, usuario); //usuario encontrado, devolvemos usuario -> Autantica
            } else {
                done(null, false); //usuario no encontrado, devolvemos false  -> NO Autentica
            }
        })
    }));
};