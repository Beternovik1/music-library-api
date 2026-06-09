/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Rutas CRUD para la colección de intérpretes
*/

// express permite manejar las rutas
const express = require('express');
// enrutador, gestiona las rutas
const ruta = express.Router();
// importar el esquema del interprete
const Interprete = require('../models/interprete_model');
// validaciones
const Joi = require('joi');

const schema = Joi.object({
  nombre:       Joi.string()
                    .min(2)
                    .max(100)
                    .required(),
  nacionalidad: Joi.string()
                    .min(2)
                    .max(100)
                    .required(),
  fecha_nac:    Joi.date()
                    .required()
});

// ruta get
ruta.get('/', (req, res) => {
  let resultado = listarInterpretesActivos();
  resultado.then(interpretes => {
    res.json(interpretes);
        })
        .catch(err => {
          res.status(400).json({ error: err });
        });
});

ruta.get('/:id', (req, res) => {
  buscarInterprete(req.params.id)
    .then(interprete => {
      if (!interprete) return res.status(404).json({ error: "El intérprete no existe" });
      res.json(interprete);
    })
    .catch(err => res.status(400).json({ error: err }));
});

// ruta post para guardar informacion
ruta.post('/', (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate({
    nombre:       body.nombre,
    nacionalidad: body.nacionalidad,
    fecha_nac:    body.fecha_nac
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  validarInterprete(body)
    .then(existe => {
      if (existe) throw new Error("El intérprete ya está registrado");
      return crearInterprete(body);
    })
    .then(interprete => res.json({ valor: interprete }))
    .catch(err => res.status(400).json({ error: err.message }));
});

// ruta put para actualizar informacion
ruta.put('/:id', (req, res) => {
  let body = req.body;

  const { error, value } = schema.validate({
    nombre:       body.nombre,
    nacionalidad: body.nacionalidad,
    fecha_nac:    body.fecha_nac
  });
  if (error) return res.status(400).json({ error: error.details[0].message });

  validarNombreEnOtro(body.nombre, req.params.id)
    .then(existe => {
      if (existe) throw new Error("El nombre ya está registrado en otro intérprete");
      return actualizarInterprete(req.params.id, body);
    })
    .then(interprete => {
      if (!interprete) return res.status(404).json({ error: "El intérprete no existe" });
      res.json({ valor: interprete });
    })
    .catch(err => res.status(400).json({ error: err.message }));
});

// ruta delete para desactivar
ruta.delete('/:id', (req, res) => {
  desactivarInterprete(req.params.id)
    .then(interprete => {
      if (!interprete) return res.status(404).json({ error: "El intérprete no existe" });
      res.json({ interprete });
    })
    .catch(err => res.status(400).json({ error: err }));
});

async function validarInterprete(body) {
  return await Interprete.findOne({ nombre: body.nombre });
}

// busca si otro interprete ya tiene ese nombre
async function validarNombreEnOtro(nombre, id) {
  return await Interprete.findOne({ nombre: nombre, _id: { $ne: id } });
}

async function crearInterprete(body) {
  let interprete = new Interprete({
    nombre:       body.nombre,
    nacionalidad: body.nacionalidad,
    fecha_nac:    body.fecha_nac
  });
  // guardar en la base
  return await interprete.save();
}

async function listarInterpretesActivos() {
  let interpretes = await Interprete.find({ estado: true });
  return interpretes;
}

async function buscarInterprete(id) {
  return await Interprete.findById(id);
}

async function actualizarInterprete(id, body) {
  let interprete = await Interprete.findByIdAndUpdate(id, {
    $set: {
      nombre:       body.nombre,
      nacionalidad: body.nacionalidad,
      fecha_nac:    body.fecha_nac
    }
  }, { new: true });
  return interprete;
}

async function desactivarInterprete(id) {
  // soft-delete: solo cambia estado a false
  let interprete = await Interprete.findByIdAndUpdate(id, {
    $set: { estado: false }
  }, { new: true });
  return interprete;
}

// exportar la ruta
module.exports = ruta;
