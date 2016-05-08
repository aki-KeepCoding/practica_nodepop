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

CONSIDERACIONES GENERALES
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


REGISTRO
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
  "response": "User created"
}
```

Errores:
- El usuario ya existe: El email del usuario es único en la base de datos


AUTENTICACIÓN
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
  "response": {
    token: "eyJhbGciOiJI......4zRb6w3-hI7aM"
  }
}
```


ANUNCIOS
---------

### Lista de anuncios completa

Lista de todos los anuncios existentes en la base de datos.

Petición GET:
```txt
> [host:puerto]/api/v1/anuncios
```

Parámetros:
- token: Token JWT (OBLIGATORIO)

Respuesta:

```javascript
{
  "status": true,
  "response": [
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

Devuelve una lista filtrada de anuncios según parámetros proporcionados.

Petición GET:
```txt
> [host:puerto]/api/v1/anuncios
```

Parámetros:
- **token**: Token JWT (OBLIGATORIO)
- **start**: Desde qué registro (OPCIONAL). Por defecto 0
- **limit**: Hasta que registro (OPCIONAL). Por defecto null
- **sort**: Se espera un string del formato: `sort=precio -nombre`. Ordenaría precio de forma ascendente y nombre de forma descendente. (OPCIONAL)
- **venta**: true|false (OPCIONAL). Si no se pasa el argumento no filtra por este parámetro
- **precio**: Un texto con el siguiente formato (OPCIONAL): 
    - `precio=10-50`: Anuncios con el precio >= 10 y <= 50
    - `precio=10-`: Anuncios con el precio >= 10
    - `precio=10`: Anuncios con el precio = 10
    - `precio=-50`: Anuncios con el precio <= 50
- **nombre**: Un texto para filtrar productos por nombre (OPCIONAL). El texto coincidirá con el inicio del nombre de producto.
- **tag**: Un texto con el siguiente formato: `tag=lifestile,motor` (OPCIONAL). Filtra los anuncios que tengan todos (exactamente todos) los tags proporcionados.
- **tagsAny**: cualquier valor (OPCIONAL). Sieste parámetro está presente modifica el comportamiento de tag y  filtra los anuncios que tengan cualquiera de los tags proporcionados.

Respuesta:

```javascript
{
  "status": true,
  "response": [
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
    //...+ objetos que cumplan los criterios
]
```

### Lista de tags existentes

Lista de todos los tags asignados a anuncios.

Petición GET:
```txt
> [host:puerto]/api/v1/anuncios/tags
```

Respuesta:
```javascript
{
  "success": true,
  "response": [
    "lifestyle",
    "motor",
    "mobile"
  ]
}
```


PUSH-TOKENS
------------
**NOTA**: Por ahora no requiere autenticación. Entiendo que esta funcionalidad habrá que securizarla  pero hasta tener claro cómo se implementa en un cliente, lo mantengo simple.

### Listado de push tokens

Devuelve una lista de todos lo push-tokens existentes en la base de datos

Petición GET:
```txt
> [host:puerto]/api/v1/tokens/
```
Respuesta:
```javascript
{
  "status": true,
  "response": [
    {
      "_id": "57291faf09c32785ae9d5c0f",
      "plataforma": "ios",
      "token": "00000000",
      "usuario": "Akixe Otegi",
      "__v": 0
    },//...más tokens...
```

### Agregar nuevos tokens

Guarda tokens en la base de datos.

Petición POST:
```txt
> [host:puerto]/api/v1/tokens/
```

Parámetros:
- **plataforma**: [ios,android]. (OBLIGATORIO).
- **token**: un texto que representa el token push (OBLIGATORIO)
- **usuario**: el id de usuario (OPCIONAL). Si no existe el id de usuario proporcionado devuelve error. Si no se proporciona el parámetro se guarda vacio.


Respuesta:
```javascript
{
  "status": true,
  "response": {
    "__v": 0,
    "usuario": "57291faf09c32785ae9d5c0b",
    "token": "00001",
    "plataforma": "ios",
    "_id": "572ee3df5b8be3a66dfdeb88"
  }
}
```


USUARIOS
--------

### Listado de todos los usuarios

Devuelve los datos de todos los usuarios.

Petición GET:
```txt
> [host:puerto]/api/v1/usuarios/
```

Parámetros
- **token**: Token JWT (OBLIGATORIO)

Respuesta:

```javascript
{
  "status": true,
  "message": [
    {
      "_id": "57291faf09c32785ae9d5c0b",
      "nombre": "Akixe Otegi",
      "email": "akixe.otegi@gmail.com",
      "clave": "$2a$10$9ShO/pCIMKcglTsHIVkIouywedJGztjZAC.8x2VvidQt6XyqiS/Ui",
      "__v": 0
    }, //...más usuarios...
```











