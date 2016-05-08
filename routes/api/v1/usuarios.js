"use strict";
var stdRes = require('../../../lib/helpers').stdRes;
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
            return res.json(stdRes.responseOK(result));
        })
        .catch(function (err) {
            return next(new Error(err));
        })
});


//Autenticar y generar JWT
router.post('/auth', function(req, res, next){
    Usuario.findOne({
        email: req.body.email
    }, function(err, usuario){
        if(err) return next(err);
        if(!usuario){
            return res.json(stdRes.responseERR(i18n('AUTH_FAILED', req.query.lang)));
        } else {
            usuario.comparaClave(req.body.clave, function(err, match){
                if(match && !err){
                    var tokenData = {
                        nombre: usuario.nombre,
                        email: usuario.email,
                        id: usuario._id
                    };
                    var token = jwt.sign(tokenData, config.secret, {expiresIn : "2 days"});
                    res.json(stdRes.responseOK({token: token}));
                } else {
                    res.json(stdRes.responseERR(i18n('AUTH_FAILED', req.query.lang)));
                }
            })
        }
    })
});

//Registro de nuevos usuarios
router.post('/registro', function (req, res, next) {
    if(!req.body.email) {
        res.json(stdRes.responseERR(i18n('REG_EMAIL_MISSING', req.query.lang)));
    } else if (!req.body.clave){
        res.json(stdRes.responseERR(i18n('REG_PASS_MISSING', req.query.lang)));
    } else if (!req.body.nombre){
        res.json(stdRes.responseERR(i18n('REG_NAME_MISSING', req.query.lang)));
    } else {
        //Crear usuario en BD
        var newUsuario = new Usuario({
            nombre : req.body.nombre,
            email: req.body.email,
            clave: req.body.clave
        });
        newUsuario.save(function(err){
            if (err) {
                res.json(stdRes.responseERR(i18n('USER_EXISTS', req.query.lang)));
                return;
            }
            res.json(stdRes.responseOK(i18n('USER_CREATED', req.query.lang)));
        })
    }
});


module.exports = router;