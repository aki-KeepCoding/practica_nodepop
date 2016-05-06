"use strict";
var jwt = require('jsonwebtoken');
var config = require('../../../config/general');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

router.get('/', function(req,res, next){
    Usuario.list()
        .then(function(result){
            console.log(result);
            res.status(200).json(result);
        })
        .catch(function (err) {
            console.error(err);
            next(err);
        })
});


//Autenticar y generar JWT
router.post('/auth', function(req, res, next){
    Usuario.findOne({
        email: req.body.email
    }, function(err, usuario){
        if(err) return next(err);
        if(!usuario){
            return res.json({success: false, message: "AUT_FAILED"});
        } else {
            usuario.comparaClave(req.body.clave, function(err, match){
                if(match && !err){
                    var tokenData = {
                        nombre: usuario.nombre,
                        email: usuario.email,
                        id: usuario._id
                    };
                    var token = jwt.sign(tokenData, config.secret, {expiresIn : "2 days"});
                    res.json({success:true, token:token});
                } else {
                    res.json({success:false, message: 'AUT_FAILED'})
                }
            })
        }


    })
});

//Registro de nuevos usuarios
router.post('/registro', function (req, res, next) {
    var err = {};
    var lang = req.query.lang || "es";
    err.lang = lang;
    if(!req.body.email) {
        err.literal = "AUT_FALTA_USUARIO";
        return next(err);
    } else if (!req.body.clave){
        err.literal = "AUT_FALTA_CLAVE";
        return next(err);
    } else {
        var newUsuario = new Usuario({
            nombre : req.body.nombre,
            email: req.body.email,
            clave: req.body.clave
        });
        newUsuario.save(function(err){
            if (err) return next(err);
            res.json({success: true, message: 'MSG_USER_CREATED' })
        })
    }
});


module.exports = router;