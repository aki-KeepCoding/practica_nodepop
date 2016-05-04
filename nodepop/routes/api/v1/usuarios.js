"use strict";

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

module.exports = router;