/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Aplicación principal. Configura Express, middleware y rutas para la API REST de biblioteca de música.
*/

const express = require('express');
const mongoose = require('mongoose');
const albums = require('./routes/albums')
const canciones = require('./routes/canciones')
const interpretes = require('./routes/interpretes')
// const albumsInterprete = require('./routes/albumsInterprete')
// const cancionesAlbum = require('./routes/cancionesAlbum')

mongoose.connect('mongodb://localhost:27017/biblioteca_musica')
        .then(() => console.log('Conectado a MongoDB !'))
        .catch(err => console.log('No se pudo conectar a MongoDB', err));

const app = express();
// indicar que usaremos un middleware con entradas en formato json
app.use(express.json());
// para recibir informacion a traves de la peticion
app.use(express.urlencoded({extended:true}));

// rutas que usaremos
app.use('/api/albums', albums);
app.use('/api/canciones', canciones);
app.use('/api/interpretes', interpretes);

// rutas de relaciones
// app.use('/api/interpretes/:interpreteId/albums', albumsInterprete);
// app.use('/api/albums/:albumId/canciones', cancionesAlbum);

const port = 3000;

app.listen(port, () => {
  console.log('API RESTFUL con MongoDB ejecutandose...');
})