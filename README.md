<!-- MarkdownTOC -->

- NODEPOP
    - 1. Crear aplicación express
    - 2. Scripts de arranque de servidor
    - 3. Crear base de datos
    - 4. Script de inicialización de BD

<!-- /MarkdownTOC -->

# NODEPOP

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


### Carga de datos
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

