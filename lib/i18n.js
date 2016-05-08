'use strict'

var config = require('../config/general')

module.exports = function (literal, lang) {
  // (!)Si no se proporciona tiramos de valor por defecto en config
  lang = lang || config.idiom

  // (i) Entiendo que el que se vaya a requerir una y otra vez
  //  el mismo fichero no es problema por que require
  //  cachea los ficheros cargados
  var i18n = require('../i18n.' + lang + '.json')
  return i18n[ literal ]
}
