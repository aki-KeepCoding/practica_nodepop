"use strict";

var mongooseHelpers = require('../../../lib/helpers').mongoose;
var passport = require('passport');
var express = require('express');
var router = express.Router();


var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Las rutas de /api/v1/anuncios están protegidas
router.use(passport.authenticate('jwt', {session:false}));

//Obtener una lista de Anuncios
router.get('/', function(req, res, next){
    //Componer options
    var options = {};
    options.start = req.query.start || 0;
    options.limit = req.query.limit || null;
    options.sort = req.query.sort|| '';

    //Componer los criterios de búsqueda
    var searchCriteria = {};
    if(req.query.venta) searchCriteria.venta = req.query.venta || null;
    //componer subcriterio precio
    if(req.query.precio){
        searchCriteria.precio = mongooseHelpers.createRange(req.query.precio); //rango en TXT, objetoCriteria
    }
    //Componer criterio Nombre
    if(req.query.nombre){
        searchCriteria.nombre = {$regex : new RegExp('^' + req.query.nombre, "i")}
    }
    //Componer criterio Tags
    if(req.query.tag){
        //field : { $in : array
        console.log()
        var tagValues = req.query.tag.split(',');
        searchCriteria.tags = {};
        searchCriteria.tags.$all = tagValues;
    }
    Anuncio.search(options, searchCriteria)
       .then(function(result){
           res.json({success: true, result:result});
       })
       .catch(function(err){
           next(err);
       })
});


router.get('/tags', function (req,res) {
    var tagSet = new Set();
    Anuncio.listTags()
        .then(function(result){

            result
                .forEach(function(resultItem){
                    resultItem.tags.forEach(function(tag){
                        tagSet.add(tag);
                    })
                });

            res.json({success:true, result:Array.from(tagSet)});
        })
});

module.exports = router;