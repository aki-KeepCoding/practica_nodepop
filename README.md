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

Requisitos:
- [**Nodemon**](http://bit.ly/1rpd3NC): permite el arranque de la aplicación node de modo que monitoriza los cambios de ficheros y rearranca el servidor de forma automática.
