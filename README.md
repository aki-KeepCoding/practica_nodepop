<!-- MarkdownTOC -->

- NODEPOP
    - 1. Crear aplicación express
    - 2. Scripts de arranque de servidor
    - 3. Crear base de datos

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


