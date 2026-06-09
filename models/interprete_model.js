/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Modelo de Mongoose para la colección de intérpretes
*/

// mongoose para definir el esquema
const mongoose = require('mongoose');

// generar un esquema para los albumes
const interpreteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  nacionalidad: {
    type: String,
    required: true
  },
  fecha_nac: {
    type: Date,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  albumes: {
    type: [String],
    default: 0
  }
});

// exportar el modelo
module.exports = mongoose.model('Interprete', interpreteSchema);