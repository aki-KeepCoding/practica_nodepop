"use strict";

var stdRes = require('../../../lib/helpers').stdRes;
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Token = mongoose.model('Token');


router.get('/', function(req, res, next){
    Token.find()
        .then(function(result){
            res.json(stdRes.responseOK(result));
        })
        .catch(function(err){
            return next(new Error(err.message));
        });
});

router.post('/', function(req,res,next) {
    var token = new Token(req.body);
    token.save()
        .then(function (result) {
            res.json(stdRes.responseOK(result));
        })
        .catch(function (err) {
            return next(new Error(err.message));
        });
});

module.exports = router;