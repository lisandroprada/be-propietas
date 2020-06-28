const express = require('express');

const Persona = require('../models/persona');

const app = express();

app.get('/persona', (req, res) => {
    Persona.find()
        .exec((err, personas) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Persona.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    personas,
                    cuantos: conteo
                });
            });
        })
})

app.post('/persona', (req, res) => {

    let body = req.body;

    let persona = new Persona({
        nombre: body.nombre
    });

    persona.save((err, personaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            persona: personaDB
        });
    });
})

module.exports = app;