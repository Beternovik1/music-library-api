/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Rutas para registrar canciones en un álbum
*/

// express permite manejar las rutas
const express = require('express');
// enrutador, gestiona las rutas
const ruta = express.Router();
// modelos que necesitamos
const Album = require('../models/album_model');
const Cancion = require('../models/cancion_model');

// ruta get para listar canciones de un album
ruta.get('/:albumId', (req, res) => {
    let resultado = listarCancionesDeAlbum(req.params.albumId);
    resultado
        .then(canciones => {
            res.json(canciones);
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// ruta get para buscar una cancion especifica del album
ruta.get('/:albumId/:cancionId', (req, res) => {
    let resultado = buscarCancionDeAlbum(req.params.albumId, req.params.cancionId);
    resultado
        .then(cancion => {
            res.json(cancion);
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// ruta post para asignar una cancion al album
ruta.post('/:albumId/:cancionId', (req, res) => {
    let resultado = registrarCancionEnAlbum(req.params.albumId, req.params.cancionId);
    resultado
        .then(album => {
            res.json({
                valor: album
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// ruta put(sin validaciones iniciales)
ruta.put('/:albumId/:cancionId', (req, res) => {
    res.json({ mensaje: "Operación PUT en canción de álbum" });
});

// ruta delete para quitar una cancion del album
ruta.delete('/:albumId/:cancionId', (req, res) => {
    let resultado = quitarCancionDeAlbum(req.params.albumId, req.params.cancionId);
    resultado
        .then(album => {
            res.json({
                valor: album
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// devuelve los ids de canciones del album
async function listarCancionesDeAlbum(albumId) {
    const album = await Album.findById(albumId);
    if (!album) throw new Error('El álbum no existe');
    return album.canciones;
}

// busca una cancion por id y verifica que este en el album
async function buscarCancionDeAlbum(albumId, cancionId) {
    const album = await Album.findById(albumId);
    if (!album) throw new Error('El álbum no existe');
    if (!album.canciones.includes(cancionId)) throw new Error('La canción no está registrada en este álbum');
    return await Cancion.findById(cancionId);
}

// agrega una cancion al album usando $addToSet para evitar duplicados
async function registrarCancionEnAlbum(albumId, cancionId) {
    const cancion = await Cancion.findById(cancionId);
    if (!cancion) throw new Error('La canción no existe en la base');

    const album = await Album.findById(albumId);
    if (!album) throw new Error('El álbum no existe en la base');

    const resultado = await Album.updateOne(
        { _id: albumId },
        { $addToSet: { canciones: cancionId } }
    );

    if (!resultado.modifiedCount) throw new Error('La canción ya está registrada en el álbum');

    return await Album.findById(albumId);
}

// quita una cancion del album usando $pullAll
async function quitarCancionDeAlbum(albumId, cancionId) {
    const album = await Album.findById(albumId);
    if (!album) throw new Error('El álbum no existe');
    if (!album.canciones.includes(cancionId)) throw new Error('La canción no está registrada en este álbum');

    await Album.updateOne(
        { _id: albumId },
        { $pullAll: { canciones: [cancionId] } }
    );

    return await Album.findById(albumId);
}

// exportar la ruta
module.exports = ruta;
