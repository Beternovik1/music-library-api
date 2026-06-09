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

const express = require('express');
const ruta = express.Router();

ruta.get('/', (req, res) => {
  res.json('Listo el GET de interpretes');
});

module.exports = ruta;