# Arranque
@todo

# Carga de datos de prueba

@todo

# Uso del API

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



