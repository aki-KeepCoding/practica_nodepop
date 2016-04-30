"use strict";

var mongoose = require('mongoose');
var conn = mongoose.connection;

// Connection event handlers
conn.on('error', console.log.bind(console, 'connection error'));
conn.once('open', function(){
    console.log('Connected to mongodb!');
})

// Connect to DB
mongoose.connect('mongodb://localhost:27017/nodepop');