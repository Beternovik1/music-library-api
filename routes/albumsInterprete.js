/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Rutas para registrar álbumes en un intérprete
*/

// express permite manejar las rutas
const express = require('express');
// enrutador, gestiona las rutas
const ruta = express.Router();
// modelos que necesitamos
const Interprete = require('../models/interprete_model');
const Album = require('../models/album_model');

// ruta get para listar albums de un interprete
ruta.get('/:interpreteId', (req, res) => {
    let resultado = listarAlbumsDeInterprete(req.params.interpreteId);
    resultado
        .then(albumes => {
            res.json(albumes);
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// ruta get para buscar un album especifico del interprete
ruta.get('/:interpreteId/:albumId', (req, res) => {
    let resultado = buscarAlbumDeInterprete(req.params.interpreteId, req.params.albumId);
    resultado
        .then(album => {
            res.json(album);
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// ruta post para asignar un album al interprete
ruta.post('/:interpreteId/:albumId', (req, res) => {
    let resultado = registrarAlbumEnInterprete(req.params.interpreteId, req.params.albumId);
    resultado
        .then(interprete => {
            res.json({
                valor: interprete
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// ruta put*(sin validaciones iniciales)
ruta.put('/:interpreteId/:albumId', (req, res) => {
    res.json({ mensaje: "Operación PUT en álbum de intérprete" });
});

// ruta delete para quitar un album del interprete
ruta.delete('/:interpreteId/:albumId', (req, res) => {
    let resultado = quitarAlbumDeInterprete(req.params.interpreteId, req.params.albumId);
    resultado
        .then(interprete => {
            res.json({
                valor: interprete
            });
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            });
        });
});

// devuelve los ids de albums del interprete
async function listarAlbumsDeInterprete(interpreteId) {
    const interprete = await Interprete.findById(interpreteId);
    if (!interprete) throw new Error('El intérprete no existe');
    return interprete.albumes;
}

// busca un album por id y verifica que este en el interprete
async function buscarAlbumDeInterprete(interpreteId, albumId) {
    const interprete = await Interprete.findById(interpreteId);
    if (!interprete) throw new Error('El intérprete no existe');
    if (!interprete.albumes.includes(albumId)) throw new Error('El álbum no está registrado en este intérprete');
    return await Album.findById(albumId);
}

// agrega un album al interprete usando $addToSet para evitar duplicados
async function registrarAlbumEnInterprete(interpreteId, albumId) {
    const album = await Album.findById(albumId);
    if (!album) throw new Error('El álbum no existe en la base');

    const interprete = await Interprete.findById(interpreteId);
    if (!interprete) throw new Error('El intérprete no existe en la base');

    const resultado = await Interprete.updateOne(
        { _id: interpreteId },
        { $addToSet: { albumes: albumId } }
    );

    if (!resultado.modifiedCount) throw new Error('El álbum ya está registrado en el intérprete');

    return await Interprete.findById(interpreteId);
}

// quita un album del interprete usando $pullAll
async function quitarAlbumDeInterprete(interpreteId, albumId) {
    const interprete = await Interprete.findById(interpreteId);
    if (!interprete) throw new Error('El intérprete no existe');
    if (!interprete.albumes.includes(albumId)) throw new Error('El álbum no está registrado en este intérprete');

    await Interprete.updateOne(
        { _id: interpreteId },
        { $pullAll: { albumes: [albumId] } }
    );

    return await Interprete.findById(interpreteId);
}

// exportar la ruta
module.exports = ruta;
