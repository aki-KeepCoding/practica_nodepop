<!-- MarkdownTOC -->

- ARRANQUE NODEPOP
    - 1. Crear aplicación express
    - 2. Scripts de arranque de servidor
    - 3. Crear base de datos
    - 4. Script de inicialización de BD
- CARGA DE DATOS DE PRUEBA
- MANEJO DE ERRORES
    - Internacionalización \(i18n\)
    - Responses standar
    - Errores controlados vs no-controlados
- AUTENTICACIÓN
- VALIDACIONES PERSONALIZADAS EN TOKENS
- Mejoras pendientes

<!-- /MarkdownTOC -->

# ARRANQUE NODEPOP

## 1. Crear aplicación express

Requisitos:
- [**Node**](https://nodejs.org/en/download/)
- [**npm**](https://docs.npmjs.com/getting-started/installing-node)
- [**Express-generator**](http://expressjs.com/en/starter/generator.html)

Crear proyecto con `express [nombre_de_proyecto] --ejs`

```sh
$> express nodepop --ejs
```

La opción `--ejs` indica a *express-generator* que debe usar las plantillas de tipo *ejs* en vez de las default (hay muchas más opciones [(+info)](http://bit.ly/21ldEfF))


## 2. Scripts de arranque de servidor

He implementado dos scripts de arranque:
- **start**: Arranca el servidor node-express con parametros más *"verbosos"*. También se añade la variable de entorno `NODE_ENV=development`.
- **startProd**: Arranca el servidor node-express con parámetros adecuados para este caso.

_**Nota**_: La variable de entorno `NODE_PATH=.` permite que podamos llamar a las librerías y módulos propios sin path relativos, partiendo desde la raíz del proyecto.


Requisitos:
- [**Nodemon**](http://bit.ly/1rpd3NC): permite el arranque de la aplicación de forma que nodemon monitoriza los cambios que hacemos y rearranca el servidor de forma automática.


## 3. Crear base de datos

Prerequisitos:
- [**MongoDB**](http://bit.ly/1rpelYR): Podemos instalarlo con [*brew*](http://bit.ly/1rpelbn) o [*manualmente*](http://bit.ly/21lhC83).
- [**Mongoose**](http://mongoosejs.com/docs/)

Crear un script de arranque de BD:

```txt
mkdir -p ./data/db;
mongod --dbpath ./data/db --directoryperdb
```

El comando `mkdir -p ./data/db;` crea el directorio */data/db* en la carpeta de proyecto si éste no existía previamente.

Las opciones `--dbpath` y `--directoryperdb` para `mongod` indican que queremos arrancar un path específico para la BD y  que si creamos más de una BD creemos un subdirectorio por cada uno.

## 4. Script de inicialización de BD
El script *install_bd.js* permite inicializar la base de datos con un set de datos de prueba. Para ejecutarlo:

```sh
$> node install_bd.js
```

El script borra los datos de la BD con conexión activa. Como el script de conexión a mongoose asume que si no pasamos un NODE_ENV concreto conectamos a una bd llamada nodepop_dev, se borrarán estos datos y se añadira el set de prueba ahí.



Nota: El script lib/connecMongoose comprueba NODE_ENV para saber si tiene que conectar a unan bd llamada nodepop o a nodepop_dev.

### Borrado de datos
Primero he creado los esquemas de mongoose Anuncio.jd, Token.js y Usuario.js en /models. Cada una de ellas tiene una funcion `clearAll()` que borra los documentos de cada uno de los esquemas.

He decidido borrarlos secuencialmente y aunque en el proyecto voy a usar promesas para las tareas asíncronas en este caso he decidido usar la librería [Async]() para entender un poco mejor su uso. Async cuenta con varias funciones de ayuda para lanzar tareas de forma paralela, en serie, etc. En este caso me interesaba lanzar las tareas en serie: Borrar Anuncios >> borrar Usuarios >> borrar Tokens. La función `async.series([array de funciones asíncronas], [callback final])`. 

```javascript
async.series([
        Anuncio.clearAll,
        Usuario.clearAll,
        Token.clearAll
    ],
    // optional callback
    function(err, results){
        //...
    }
);
```

A tener en cuenta: Cada función llamada en el array de tasks se le pasa un callback cuyos resultados se recogen en la función callback final a través del array *results* ([res_Anuncio.clearAll, res_Usuario.clearAll, res_Token.clearAll]).

Para entender mejor cómo funciona async.series se puede consultar su [documentación](http://bit.ly/1pSUUX1)


# CARGA DE DATOS DE PRUEBA

**¡¡(160508) Nota!!**: Después de añadir una precondición de guardado en la que se encripta la clave en cada 'save' el paso uno deja de ser necesario y lo elimino.

He añadido a la secuencia dos funciones más:

 1. Encriptar las claves de usuario (`encryptUserPass`)
 2. Guardar nuevo set de datos (`loadNewData`)

 Para encriptar la clave he creado una nueva función estática en el esquema de  usuario, `encryptClave(usuario, callback)`. Esta función es llamada mediante la función [map de Async](https://github.com/caolan/async#mapcoll-iteratee-callback).

```javascript
function encryptUserPass(callback){
    async.map(usuariosData, Usuario.encryptClave, callback);
    return;
}
```

La función loadNewData llama a la función `async.parallel([arrayDeFunciones], callback)`. Para más info consultar documentación de [async.parallel](https://github.com/caolan/async#paralleltasks-callback)

```javascript
function loadNewData(callback){
    async.parallel([
            function(callback){
                Usuario.saveAll(usuariosData, callback);
            },
            function(callback){
                Anuncio.saveAll(anunciosData, callback);
            }
        ],
        // optional callback
        function(err, results){
            callback(err, results);
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
        });
}
```

Cada tarea enviada a async.parallel ejecuta una función estática para cada esquema de usuarios, anuncios y tokens (`saveAll(arrayUsuarios, callback)`) que realiza el guardado de un array de elementos recibidos. Esta función utiliza la librería Async para guardar en paralelo cada uno de los usuarios. La función `async.each([ArrayDeObjAGuardar], funcionAAplicar, callbackOpcional)`. A cada elemento le aplicamos una función que llama a `Usuario.save`. La función debe llamar al callback que recibe pero en este caso tiene un pequeño handicap: sólo puede responder con un error. No es capaz de reenviar los resultados combinados como en el caso de `async.series`. En la [documentación](https://github.com/caolan/async#eachcoll-iteratee-callback) se explica en detalle el funcionamiento de `async.each`.


```javascript
usuarioSchema.statics.saveAll = function(usuariosData, callback){
    async.each(usuariosData, function(usuarioData, cb){
        var usuario = new Usuario(usuarioData);
        usuario.save(function(err, newUsuario){
            if (err){
                cb(err);
                return;
            }
            console.log(`Usuario ${newUsuario.nombre} guardado en BD`);
            cb();
            return;
        })
    }, function(err){
        callback(err, 'Usuarios Guardados');
    })
}
```

**NOTA!!** : Comentar que no me había dado cuenta de que [Mongoose ya soporta nativamente el guardado de múltiples documentos](http://stackoverflow.com/a/14133893). Dejo intacta la implementación de saveAll en este caso a efectos de mejor entendimiento personal de la librería *async* y sus funciones...en un proyecto real hubiera implementado el guardado múltiple con el API oficial.

# MANEJO DE ERRORES

## Internacionalización (i18n)

La primera aproximación ha sido crear manualmente esta funcionalidad.

El módulo `lib/i18n.js` se encarga de ello. En la raíz de proyecto hay ficheros denominados i18n.XX.json, siendo XX el id de idioma que contiene (es, en,...). Cada uno de ellos contiene pares clave/valor. El módulo i18n recibe el id de lenguaje y la clave del texto que tiene que devolver.

Un ejemplo:

```javascript
var i18n = require('../../../lib/i18n');
//...
i18n('AUTH_FAILED', req.query.lang)
//...
```

Si el parámetro lang está vacío por defecto será 'es'.

## Responses standar

He creado una objeto helper en el módulo `lib/helpers.js` que contiene funciones para componer los objetos de respuesta de forma standar.

Por ejemplo:
```javascript
var stdRes = require('../../../lib/helpers').stdRes;
//...
res.json(stdRes.responseERR(i18n('AUTH_FAILED', req.query.lang))); //Respuesta de error
//...
res.json(stdRes.responseOK(i18n('USER_CREATED', req.query.lang))); //Respuesta correcta
//...


```
Las funciones `responseERR` y `responseOK` devolverán un objeto de tipo:

```javascript
{
    success: [true|false], /*Según si es resp. correcta o errónea*/
    response: [Obj, Str,...] /*Contiene un objeto, string u otra cosa que devuelva el API*/
}
```

## Errores controlados vs no-controlados

Cuando se produce un error de tipo controlado, esto es, sé el origen y puedo responder yo mismo con un mensaje explicativo respondemos con status 200 y enviando un objeto de tipo `{success: false, response: error}`

Por ejemplo. Si durante la autenticación sabemos que un usuario no existe o que la contraseña no coincide:

```javascript
//...
if(!req.body.email) {
    res.json(stdRes.responseERR(i18n('REG_EMAIL_MISSING', req.query.lang))); //{success:false, response: ´string error'}
} else if (!req.body.clave){
    res.json(stdRes.responseERR(i18n('REG_PASS_MISSING', req.query.lang))); //{success:false, response: ´string error'}
//..
```

En otros casos, si no puedo controlar el tipo de error paso el mensaje de error al siguiente middleware mediante el callback correspondiente..*[]:

```javascript
router.get('/', passport.authenticate('jwt', {session:false}), function(req,res, next){
     Usuario.list()
         .then(function(result){
             return res.json(stdRes.responseOK(result));
         })
         .catch(function (err) {
             return next(new Error(err)); // Error no controlado
         })
 });
```


# AUTENTICACIÓN

Para la autenticación he decidido usar la librería [Passport](http://passportjs.org/) ya que me interesaba conocer esta librería un poco mejor.

Para JWT usa la estrategia [passport-jwt](https://github.com/themikenicholson/passport-jwt).

El flujo sería el siguiente

1. Usuario se registra en `api/v1/usuarios/registro`
2. Se genera un registro en base de datos con email, nombre y contraseña hasheada (con librería bcrypt)
3. El usuario se autentica con email/clave en `api/v1/usuarios/auth`



4. Si los datos son correctos se genera un token JWT mediante la librería [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

```javascript
//...si clave/email correcto...
        var tokenData = {
            nombre: usuario.nombre,
            email: usuario.email,
            id: usuario._id
        };
        var token = jwt.sign(tokenData, config.secret, {expiresIn : "2 days"});
        res.json(stdRes.responseOK({token: token}));
//...
```

5. En las siguientes peticiones al api el usuario pasa el token JWT y si el token es válido(no ha expirado, el usuario existe, etc...) le permite acceder al mismo. Passport se encarga de ello mediante la estrategia `jwt`. Para ello pasamos como middleware la función passport.authenticate allá donde haga falta. En el proyecto he usado dos estrategias:

1. Proteger una ruta congreta:

```javascript
//pasamos passport como middleware en un get, post....
router.get('/', passport.authenticate('jwt', {session:false}), function(req,res, next){
    Usuario.list()
        .then(function(result){
            return res.json(stdRes.responseOK(result));
        })
        .catch(function (err) {
            return next(new Error(err));
        })
});
```

2. Proteger tódas las rutas desde un path concreto...

```javascript
//...ejemplo de anuncios...

//pasamos como middleware previamente a la definición de las rutas mediante `router.use`
//Las rutas de /api/v1/anuncios están protegidas
router.use(passport.authenticate('jwt', {session:false}));

//Obtener una lista de Anuncios
router.get('/', function(req, res, next){
//....
```


Para que passport entienda la estrategia JWT es necesario configurar passport-jwt para lo que he generado un módulo en `lib/passport_jwt`:

```javascript
"use strict";
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');
var config = require('../config/general');


//inyectamos la dependencia de la librería passport
module.exports = function(passport){
    //configuramos passport-jwt
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');
    opts.secretOrKey = config.secret;

    //añadimos nueva estrategia de autenticación a Passport
    passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
        //Búsqueda de usuario en bd por el id
        //en el payload JWT nos llegarán los datos del usuario que es lo que
        //hemos guardado previamente cuando hemos generado la key
        Usuario.findOne({_id: jwtPayload.id}, function (err, usuario) {
            if(err) return done(err, false);//error en la bd, devolvemos false (y error)
            if(usuario) {
                done(null, usuario); //usuario encontrado, devolvemos usuario -> Autantica
            } else {
                done(null, false); //usuario no encontrado, devolvemos false  -> NO Autentica
            }
        })
    }));
};
```

Se configura passport-jwt para leer el token desde una queryParameter que se llama 'token': `opts.jwtFromRequest = ExtractJwt.fromUrlQueryParameter('token');`. 

También podría haber optado por recibir en la cabecera el token ([u otras opciones](http://bit.ly/23yCSGK))pero sin tener más información sobre este proyecto he decidido simplificar (así puedo usar un navegador normal para pruebas).

Para general la estrategia jwt de passpor usamos `new JwtStrategy(jwtPayload, done){}`. 
- `jwtPayload`: Este parámetro recibe el token descifrado por lo que puede leer su contenido. En nuestro caso habíamos guardado el nombre, email e id del usuario y utilizamos éste último para comprobar que el usuario existe en la base de datos. Si existe llamamos al callback dando por válido el token proporicionado.


# VALIDACIONES PERSONALIZADAS EN TOKENS

He aplicado una validaciones personalizada en el modelo de Tokens (push). Esta validación permite comprobar que el id de usuario (si es que se ha proporcionado) exista. 

```javascript
//Custom validation
//Comprobamos que el usuario exista antes de asignarlo al token
pushTokenSchema.path('usuario').validate(function (value, respond) {
    if (!value) respond(true);

    Usuario.findOne({_id: value}, function (err, doc) {
        if (err || !doc) {
            respond(false);
        } else {
            respond(true);
        }
    });

},"NON_EXISTENT_USER_ID");
```



# Mejoras pendientes

- **Internacionalización con i18n-2**: Para la internacionalización me gustaría usar la librería [i18n-2](https://github.com/jeresig/i18n-node-2). En el grupo de slack se ha hablado bien de ella y mantener un módulo propio no parece ser la mejor solución teniendo en cuenta que no es una funcionalidad crítica de la aplicación. 
- **Documentación con JSDoc**: Ante las complejidades derivadas de usar ioDocs, JSDoc mi primera aproximación ha sido escribir la documentación a mano. Después de analizar las opciones probaría JSDoc.
- **Simplificar installBD**: La carga inicial de datos la he realizado teniendo en mente experimentar con la librería Async. Por eso quizá se me haya ido de las manos en complejidad del resultado final, aunque me ha servido para entender mejor lo que hace Async respecto a promesas (que era lo que yo ya conocía de antes...). 





