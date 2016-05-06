"use strict";
var passport = require('passport');
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Las rutas de /api/v1/anuncios están protegidas
router.use(passport.authenticate('jwt', {session:false}));

//Obtener una lista de Anuncios
router.get('/', function(req, res, next){
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;

    Anuncio.list()
       .then(function(result){
           res.json({success: true, result:result});
       })
       .catch(function(err){
           next(err);
       })
});

module.exports = router;  
