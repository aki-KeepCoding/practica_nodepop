"use strict";


/*Helpers para Mongoose*/

var Helpers = {};

/* 
MONGOOSE HELPERS
 */
Helpers.mongoose = {
    //Componer criterio de tipo rango
    // Recibe texto tipo 10-50(entre 10 y 50), -10 (menor que 10), 10 o 10- (mayor que 10)
    // Por defecto sera igualda tipo mayor/menor o igual
    createRange : function (range) {
        var result = {};
        range = range.replace('-', ' -'); //si es 10-50 convertimos a 10- 50 (para luego poder hacer split)
        var components = range.split(' ');//si 10-50 => ['10-', '50'] (mayor/igual 10 y menor/igual 50)
        if (components.length === 1) {
            var value = parseFloat(components[0]);
            result = value || null; //det tipo XX -> property: value
            return result;
        }

        // tratar componentes de valor de entrada y comvertirlos a obj Mongoose
        components.forEach(function(component, index){
            var value = parseFloat(component.replace('-','')); //quitamos el - para convertir a float
            if (!value) return this; //el valor no es numérico (parseFloat = NaN) no seguimos

            if(component[0] === '-' ){ //tipo -XX
                this.$lte = value;// $lte:xx
            } else {//tipo XX-
                this.$gte = value; //$gte:xx
            }
            return this;
        }, result); //aplicamos result como 'this' dentro de forEach [(MDN doc forEach)](http://mzl.la/1VNCBAH)


        return result;
    }
};

Helpers.stdRes = {
    responseOK : function (message) {
        return {
            status: true,
            response: message
        }
    },
    responseERR : function (message){
        return {
            status: false,
            response: message
        }
    }
};


module.exports = Helpers;

