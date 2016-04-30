"use strict";

var mongoose = require('mongoose');
var conn = mongoose.connection;
var dbName = "";
// Connection event handlers
conn.on('error', console.log.bind(console, 'connection error'));
conn.once('open', function(){
    console.log(`Connected to  ${dbName}!`);
})

// Connect to DB
if (process.env.NODE_ENV !== "production"){
    dbName = "nodepop_dev";
    mongoose.connect('mongodb://localhost:27017/nodepop_dev');
} else {
    dbName = "nodepop";
    mongoose.connect('mongodb://localhost:27017/nodepop');
}