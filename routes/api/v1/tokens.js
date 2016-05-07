"use strict";

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Token = mongoose.model('Token');


router.get('/', function(req,res){
    Token.find()
        .then(function(result){
            res.json({success:true, result:result});
        })
        .catch(function(err){
            return next(new Error(err.message));
        });
});

router.post('/', function(req,res,next) {
    console.log(req.body);
    var token = new Token(req.body);
    token.save()
        .then(function (result) {
            res.json({success: true, result: result});
        })
        .catch(function (err) {
            return next(new Error(err.message));
        });
});

module.exports = router;