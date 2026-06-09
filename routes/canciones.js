/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Rutas CRUD para la colección de canciones
*/

// express permite manejar las rutas
const express = require('express');
// enrutador, gestiona las rutas
const ruta = express.Router();
// importar el esquema de canciones
const Cancion = require('../models/cancion_model');
// validaciones
const Joi = require('joi');

const schema = Joi.object({
  titulo:   Joi.string().min(1).max(200).required(),
  duracion: Joi.number().positive().required()
});

// ruta get
ruta.get('/', (req, res) => {
  let resultado = listarCancionesActivas();
  resultado.then(canciones => {
    res.json(canciones);
  })
  .catch(err => {
    res.status(400).json({ error: err });
  });
});

// ruta get por id
ruta.get('/:id', (req, res) => {
  buscarCancion(req.params.id)
    .then(cancion => {
      if (!cancion) return res.status(404).json({ error: "La canción no existe" });
      res.json(cancion);
    })
    .catch(err => res.status(400).json({ error: err }));
});

// ruta post para guardar informacion
ruta.post('/', (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate({
    titulo:   body.titulo,
    duracion: body.duracion
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  crearCancion(body)
    .then(cancion => res.json({ valor: cancion }))
    .catch(err => res.status(400).json({ error: err.message }));
});

// ruta put para actualizar informacion
ruta.put('/:id', (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate({
    titulo:   body.titulo,
    duracion: body.duracion
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  actualizarCancion(req.params.id, body)
    .then(cancion => {
      if (!cancion) return res.status(404).json({ error: "La canción no existe" });
      res.json({ valor: cancion });
    })
    .catch(err => res.status(400).json({ error: err }));
});

// ruta delete para desactivar
ruta.delete('/:id', (req, res) => {
  desactivarCancion(req.params.id)
    .then(cancion => {
      if (!cancion) return res.status(404).json({ error: "La canción no existe" });
      res.json({ cancion });
    })
    .catch(err => res.status(400).json({ error: err }));
});

async function crearCancion(body) {
  let cancion = new Cancion({
    titulo:   body.titulo,
    duracion: body.duracion
  });
  // guardar en la base
  return await cancion.save();
}

async function listarCancionesActivas() {
  let canciones = await Cancion.find({ estado: true });
  return canciones;
}

async function buscarCancion(id) {
  return await Cancion.findById(id);
}

async function actualizarCancion(id, body) {
  let cancion = await Cancion.findByIdAndUpdate(id, {
    $set: {
      titulo:   body.titulo,
      duracion: body.duracion
    }
  }, { new: true });
  return cancion;
}

async function desactivarCancion(id) {
  let cancion = await Cancion.findByIdAndUpdate(id, {
    $set: { estado: false }
  }, { new: true });
  return cancion;
}

// exportar la ruta
module.exports = ruta;
