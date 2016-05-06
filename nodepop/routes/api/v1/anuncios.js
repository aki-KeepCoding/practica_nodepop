"use strict";
var passport = require('passport');
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Las rutas de /api/v1/anuncios están protegidas
router.use(passport.authenticate('jwt', {session:false}));

//
router.get('/', function(req, res, next){
    var lang = req.query.lang || "es";
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;

    Anuncio.list()
       .then(function(result){
           res.json(result);
           return;
       })
       .catch(function(err){
           err.lang = lang;
           err.literal = err;
           next(err);
       })
});

module.exports = router;  
