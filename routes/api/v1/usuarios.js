"use strict";
var jwt = require('jsonwebtoken');
var passport = require('passport');
var i18n = require('../../../lib/i18n');
var config = require('../../../config/general');
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

router.get('/', passport.authenticate('jwt', {session:false}), function(req,res, next){
    Usuario.list()
        .then(function(result){
            console.log(result);
            res.status(200).json(result);
        })
        .catch(function (err) {
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
            return res.json({success: false, message: i18n('AUTH_FAILED', req.query.lang)});
        } else {
            console.log("llega");
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
                    res.json({success:false, message: i18n('AUTH_FAILED', req.query.lang)});
                }
            })
        }


    })
});

//Registro de nuevos usuarios
router.post('/registro', function (req, res, next) {
    if(!req.body.email) {
        res.json({success: false, message:i18n('REG_EMAIL_MISSING', req.query.lang)});
    } else if (!req.body.clave){
        res.json({success: false, message:i18n('REG_PASS_MISSING', req.query.lang)});
    } else if (!req.body.nombre){
        res.json({success: false, message:i18n('REG_NAME_MISSING', req.query.lang)});
    } else {
        //Crear usuario en BD
        var newUsuario = new Usuario({
            nombre : req.body.nombre,
            email: req.body.email,
            clave: req.body.clave
        });
        newUsuario.save(function(err){
            if (err) {
                res.json({success: false, message: i18n('USER_EXISTS', req.query.lang)});
                return;
            }
            res.json({success: true, message:i18n('USER_CREATED', req.query.lang)});
        })
    }
});


module.exports = router;