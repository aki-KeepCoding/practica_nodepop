"use strict";

var mongooseHelpers = require('../../../lib/helpers').mongoose;
var stdRes = require('../../../lib/helpers').stdRes;
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
    //Precio
    if(req.query.precio){
        searchCriteria.precio = mongooseHelpers.createRange(req.query.precio); //rango en TXT, objetoCriteria
    }
    //Nombre
    if(req.query.nombre){
        searchCriteria.nombre = {$regex : new RegExp('^' + req.query.nombre, "i")}
    }
    //Tags
    if(req.query.tag){
        console.log()
        var tagValues = req.query.tag.split(',');
        searchCriteria.tags = {};
        var tagsAny;
        if(req.query.tagsAny){
            console.log("in");
            searchCriteria.tags.$in = tagValues;
        } else {
            console.log("all");
            searchCriteria.tags.$all = tagValues;
        }
    }


    Anuncio.search(options, searchCriteria)
       .then(function(result){
           return res.json(stdRes.responseOK(result));
       })
       .catch(function(err){
           return next(new Error(err));
       })
});


router.get('/tags', function (req,res) {
    var tagSet = new Set(); //Un set es una colección de objetos que no se pueden repetir
    Anuncio.listTags()
        .then(function(result){
            result
                .forEach(function(resultItem){
                    resultItem.tags.forEach(function(tag){
                        tagSet.add(tag); //Si el tag ya existía en el set no se vuelve a añadir
                    })
                });
            res.json(stdRes.responseOK(Array.from(tagSet))); //Array.from permite cnvertir un set a tipo array [(doc MDN set)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
        })
});

module.exports = router;