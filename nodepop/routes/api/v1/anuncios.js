"use strict";

var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');


router.get('/', function(req, res, next){
    var lang = req.query.lang || "es";
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;

    Anuncio.list()
       .then(function(result){
           console.log(result);
           res.status(200).json(result);
           return;
       })
       .catch(function(err){
           err.lang = lang;
           err.literal = "GENERIC_ERROR";
           next(err)
       })
});

module.exports = router;  
