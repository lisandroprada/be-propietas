const express = require('express');

const { Casa, Persona } = require('../models/prueba');

const app = express();

app.get('/casa', (req, res) => {
  let pageSize = req.query.pageSize || 0;
  pageSize = Number(pageSize);

  let currentPage = req.query.currentPage || 1;
  currentPage = Number(currentPage);

  let saltar = (currentPage - 1) * pageSize;

  let search = req.query.search || '';
  let regex = new RegExp(search, 'i');

  let termino = { address: regex };

  Casa.find(termino)
    .populate('contacto')
    .exec((err, casas) => {
      if (err) return res.status(400).json({ err });
      res.json({
        casas,
      });
    });
});

app.post('/casa', (req, res) => {
  let body = req.body;

  let casa = new Casa({
    address: body.address,
    contacto: body.contacto,
  });

  casa.save((err, casaDB) => {
    if (err) return res.status(500).json({ err });
    res.status(201).json({
      casa: casaDB,
    });
  });
});

app.get('/persona', (req, res) => {
  Persona.find().exec((err, personas) => {
    if (err) return res.status(400).json({ err });
    res.json({
      personas,
    });
  });
});

app.post('/persona', (req, res) => {
  let body = req.body;
  let persona = new Persona({
    nombre: body.nombre,
  });

  persona.save((err, personaDB) => {
    if (err) return res.status(500).json({ err });
    res.status(201).json({
      persona: personaDB,
    });
  });
});

module.exports = app;
