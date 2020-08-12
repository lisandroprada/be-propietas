const express = require('express');

const Ubicacion = require('../models/ubicacion');

const app = express();

app.get('/ubicacion', (req, res) => {
    Ubicacion.find({}, 'provincia iso_31662')
        .exec((err, provincias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Ubicacion.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    provincias,
                    cuanto: conteo
                });
            });
        })
})

// Buscar localidades
app.get('/ubicacion/buscar/:termino', (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Ubicacion.find({ iso_31662: regex })
        .exec((err, localidades) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                localidades
            })
        })
})

module.exports = app;