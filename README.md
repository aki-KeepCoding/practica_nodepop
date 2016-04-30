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

El scritp borra los datos de la BD con conexión activa. Como el script de conexión a mongoose asume que si no pasamos un NODE_ENV concreto conectamos a una bd llamada nodepop_dev, se borrarán estos datos y se añadira el set de prueba ahí.



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

