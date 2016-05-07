INSTALACIÓN
===========

1. Descargar código fuente:
```sh
$> git clone https://github.com/aki-KeepCoding/practica_nodepop.git
```

2. Instalar dependencias del proyecto:

```sh
$> cd practica_nodepop
$> npm install
```

3. Instalar MongoDB

- [**MongoDB**](http://bit.ly/1rpelYR): Podemos instalarlo con [*brew*](http://bit.ly/1rpelbn) o [*manualmente*](http://bit.ly/21lhC83).


ARRANQUE DEL SERVIDOR
==========================

Se provee un script de arranque del servidor de base de datos Mongo:

```sh
$> ./starDB.sh
```


Se proveen dos script para el arranque del servidor API:

a) Modo desarrollo
-------------------
```sh
$> npm start
# NODE_PATH=. DEBUG=express,nodepop:* PORT=3001 NODE_ENV=development nodemon ./bin/www
```

Accediendo en un navegador a `http://localhost:3001` podremos acceder a la página principal.

b) Modo Producción
------------------
```sh
$> npm startProd
# NODE_PATH=. DEBUG=express,nodepop:* PORT=3001 NODE_ENV=development nodemon ./bin/www
```

Accediendo en un navegador a `http://localhost:3000` podremos acceder a la página principal.


CARGA DE DATOS DE PRUEBA
========================
@todo

API
===

Consideraciones generales
-------------------------

### Host y puerto
En todos los ejemplos nos referiremos a la base del las url como...

```txt
> [host:puerto]/path/api
```
- *host:puerto* depende de cómo se haya lanzado la aplicación Node, pero en una instalación local será: `http://localhost:3001` (modo desarrollo) o `http://localhost:3000` (modo producción).

### Token JWT

Algunas peticiones al API están protegidas y es necesario enviar un Token JWT que previamente ha sido concedido durante el proceso de autenticación. Es necesario enviar en cada petición un parámetro de nombre `token` con la clave concedida. Por tanto cualquier petición de este tipo se realizará de la siguiente manera:

```txt
> [host:puerto]/path/api?token=[JWT String]
```

**Nota**: El token expira cada 2 días por lo que es necesario autenticarse otra vez  después de que pase ese tiempo (ver instrucciones de autenticación más adelante).

### Lenguaje
Se puede especificar el lenguaje en el que se desean recibir las notificaciones de respuesta en cada petición añadiendo el parámetro `lang` :
```txt
> [host:puerto]/path/api?lang=[es|en]
```
Si no se especifica ningún valor las respuestas por defecto se harán en español (`lang=es`).


Registro
--------
Petición POST a la siguiente URL:
```txt
> [host:puerto]/api/v1/usuarios/registro
```

Parámetros:
- **nombre** : Nombre de usuario (OBLIGATORIO)
- **email**: Correo electrónico del usuario (OBLIGATORIO)
- **clave**: Clave del usuario (OBLIGATORIO)

Respuesta:
 ```javascript
{
  "success": true,
  "message": "User created"
}
```

Errores:
- El usuario ya existe: El email del usuario es único en la base de datos


Autenticación
-------------
Es necesario autenticarse para poder realizar algunas consultas al API

Petición POST a la siguiente URL:
```txt
> [host:puerto]/api/v1/usuarios/auth
```

Parámetros POST (body - x-www-form-urlencoded):

- email : El email del usuario (OBLIGATORIO)
- clave : La clave del usuario (OBLIGATORIO)


Respuesta:
```javascript
{
  "success": true,
  "token": "eyJhbGciOiJI......4zRb6w3-hI7aM"
}
```


Anuncios
---------

### Lista de anuncios completa

Petición GET:
```txt
> [host:puerto]/api/v1/anuncios
```

Parámetros:
- token: Token JWT (OBLIGATORIO)

Respuesta:

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
    //...(todos los objetos en la bE)
]
```

### Lista filtrada de anuncios


Petición GET:
```txt
> [host:puerto]/api/v1/anuncios
```
Parámetros:
- token: Token JWT (OBLIGATORIO)
- start:
- limit:
- sort:
- venta:
- precio:
- nombre:
- tag:

Respuesta:

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
    //...+ objetos
]
```

