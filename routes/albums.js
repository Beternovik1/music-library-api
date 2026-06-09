/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Rutas CRUD para la colección de álbumes
*/

// express permite manejar las rutas
const express = require('express');
// enrutador, gestiona las rutas
const ruta = express.Router();
// importar el esquema de albums
const Album = require('../models/album_model')
// validaciones
const Joi = require('joi');

// esquema de validacion joi
const schema = Joi.object({
  titulo: Joi.string()
              .min(3)
              .max(100)
              .required(),
  disquera: Joi.string()
              .min(1)
              .max(100)
              .required(),
  etiqueta: Joi.string()
              .min(1)
              .max(100)
              .required(),
  anio: Joi.number()
            .integer()
            .min(1900)
            .max(2026)
            .required()
})

// ruta get
ruta.get('/', (req, res) => {
  let resultado = listarAlbumsActivos();
  resultado.then(albums => {
          res.json(albums);
        })
        .catch(err => {
          res.status(400).json({
            error: err
          });
        });
});

ruta.get('/:id', (req, res) => {
  buscarAlbum(req.params.id)
    .then(album => {
      if (!album) return res.status(404).json({ error: "El álbum no existe" });
      res.json(album);
    })
    .catch(err => res.status(400).json({ error: err }));
});

// ruta post para guardar informacion 
ruta.post('/', (req, res) => {
  let body = req.body;

  const {error, value} = schema.validate({
    titulo: body.titulo,
    disquera: body.disquera,
    etiqueta: body.etiqueta,
    anio: body.anio
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  validarAlbum(body)
    .then(existe => {
      if (existe) throw new Error("El álbum ya está registrado");
      return crearAlbum(body);
    })
    .then(album => res.json({ valor: album }))
    .catch(err => res.status(400).json({ error: err.message }));
});

// ruta put para actualizar informacion
ruta.put('/:id', (req, res) => {
  let body = req.body;

  const {error, value} = schema.validate({
    titulo: body.titulo,
    disquera: body.disquera,
    etiqueta: body.etiqueta,
    anio: body.anio
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  validarAlbum(body, req.params.id)
    .then(existe => {
      if (existe) throw new Error("Esa combinación de título, etiqueta y año ya está registrada en otro álbum");
      return actualizarAlbum(req.params.id, body);
    })
    .then(valor => {
      if (!valor) return res.status(404).json({ error: "El álbum no existe" });
      res.json({ valor });
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

// ruta delete para desactivar 
ruta.delete('/:id', (req, res) => {
  desactivarAlbum(req.params.id)
    .then(valor => {
      if (!valor) return res.status(404).json({ error: "El álbum no existe" });
      res.json({ album: valor });
    })
    .catch(err => res.status(400).json({ error: err }));
});

async function validarAlbum(body, excludeId){
  let query = {
    titulo: body.titulo,
    etiqueta: body.etiqueta,
    anio: body.anio
  };
  if (excludeId) query._id = { $ne: excludeId };
  return await Album.findOne(query);
}

async function crearAlbum(body){
  let album = new Album({
    titulo: body.titulo,
    disquera: body.disquera,
    etiqueta: body.etiqueta,
    anio: body.anio,
    // canciones: body.canciones
  });
  // Guardar el album en la base
  return await album.save();
}

async function actualizarAlbum(id, body){
  let album = await Album.findByIdAndUpdate(id, {
    $set: {
      titulo: body.titulo,
      disquera: body.disquera,
      etiqueta: body.etiqueta,
      anio: body.anio
    }
  }, {new: true});
  return album;
}

async function desactivarAlbum(id){
  let album = await Album.findByIdAndUpdate(id, {
    $set: {
      estado: false
    }
  }, {new: true});
return album;
}

async function listarAlbumsActivos(){
  let albums = await Album.find({ estado: true });
  return albums;
}

async function buscarAlbum(id) {
  return await Album.findById(id);
}

//exportar la ruta
module.exports = ruta;
