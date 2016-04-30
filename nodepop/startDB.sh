#!/bin/bash
# Si no existe el directorio de BD para el proyecto lo creamos
mkdir -p ./data/db;

# Commando de arranque de BD mongo para el proyecto
mongod --dbpath ./data/db --directoryperdb
