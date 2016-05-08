'use strict'

var Helpers = {}

/*
 * MONGOOSE HELPERS
 */
Helpers.mongoose = {
  // Componer criterio de tipo rango
  //  Recibe texto tipo 10-50(entre 10 y 50), -10 (menor que 10), 10 o 10- (mayor que 10)
  //  Por defecto sera igualda tipo mayor/menor o igual
  createRangeFilter: function (range) {
    var result = {}

    // si es 10-50 convertimos a 10- 50 (para luego poder hacer split)
    // si 10-50 => ['10-', '50'] (mayor/igual 10 y menor/igual 50)
    range = range.replace('-', ' -')
    var components = range.split(' ')
    if (components.length === 1) {
      var value = parseFloat(components[ 0 ])
      result = value || null // Tipo XX -> property: value
      return result
    }

    // tratar componentes de valor de entrada y comvertirlos a obj Mongoose
    components.forEach(function (component) {
      var value = parseFloat(component.replace('-', '')) // quitamos el - para convertir a float
      if (!value) return this // el valor no es numérico (parseFloat = NaN) no seguimos

      if (component[ 0 ] === '-') {
        // -XX
        this.$lte = value
      } else {
        // XX-
        this.$gte = value
      }
      return this
    }, result) // aplicamos result como 'this' dentro de forEach [(MDN doc forEach)](http://mzl.la/1VNCBAH)
    return result
  }
}

Helpers.stdRes = {
  responseOK: function (message) {
    return {
      status: true,
      response: message
    }
  },
  responseERR: function (message) {
    return {
      status: false,
      response: message
    }
  }
}

module.exports = Helpers
