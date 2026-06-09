/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Modelo de Mongoose para la colección de álbumes
*/

const mongoose = require('mongoose');

// generar un esquema para los albumes
const albumSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  disquera: {
    type: String,
    required: true
  },
  etiqueta: {
    type: String,
    required: true
  },
  anio: {
    type: Number,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  canciones: {
    type: [String],
    default: 0
  }
});

// exportar el modelo
module.exports = mongoose.model('Album', albumSchema);