/*
  Carrera: Licenciatura en Ingeniería de Datos e Inteligencia Artificial
  Curso: Bases de Datos no Relacionales
  Semestre: 2026 Enero-Junio
  Práctica 2
  Fecha: 2026-06-08
  Profesor: Dr. Juan Carlos Gómez Carranza
  Autor: Alfaro Hernandez Edgar
  Descripción: Modelo de Mongoose para la colección de canciones
*/

const mongoose = require('mongoose');

// generar un esquema para los albumes
const cancionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  }
});

// exportar el modelo
module.exports = mongoose.model('Cancion', cancionSchema);