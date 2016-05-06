"use strict";
var config = require('../config/general');
module.exports = function(literal, lang){
    console.log("idiom", lang);
    lang = lang? lang: config.idiom;//Si no se proporciona tiramos de valor por defecto en config
    var i18n = require('../i18n.' + lang + '.json');
    return i18n[literal];
};