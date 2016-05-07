# Instalación

git clone
# Arranque

Se proveen dos script para el arranque de la aplicación:


"start": "NODE_PATH=. DEBUG=express,nodepop:* PORT=3001 NODE_ENV=development nodemon ./bin/www",
    "startProd": "NODE_PATH=. PORT=3000 NODE_ENV=production nodemon ./bin/www"

```sh
$> npm start
```
Arranca la aplicación en modo desarrollo. el comando que ejecuta es el siguiente:

```sh
NODE_PATH=. DEBUG=express,nodepop:* PORT=3001 NODE_ENV=development nodemon ./bin/www
```

En un entorno local


# Carga de datos de prueba



# Uso del API

## A cerca de la documentación

### Host y puerto
En todos los ejemplos nos referiremos a la base del las url como...

```txt
> [host:puerto]/path/api
```
- *host:puerto* depende de cómo se haya lanzado la aplicación Node



## Anuncios

Obtener todos los anuncios:

```txt
> [host:puerto]/api/v1/anuncios?lang=[es|en]
```
- host:puerto depende de cómo se haya lanzado la aplicación Node
- El parametro **lang** es opcional: por defecto valor *es*;

El esquema JSON devuelto:

```javascript
[
    {
        _id: "57291faf09c32785ae9d5c0d",
        nombre: "Bicicleta",
        venta: true,
        precio: 230.15,
        foto: "bici.jpg",
        __v: 0,
        tags: [
            "lifestyle",
            "motor"
        ]
    },
    //...
]
```



