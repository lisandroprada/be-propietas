const express = require('express');

const Diccionario = require('../models/diccionario');

const app = express();

app.get('/diccionario', (req, res) => {
    Diccionario.find()
        .exec((err, diccionario) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }
            res.status(200).json({
                status: true,
                diccionario
            });
        });
})

app.get('/diccionario/termino', (req, res) => {
    let search = req.query.search;
    Diccionario.findOne({ termino: search })
        .exec((err, termino) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    err
                });
            }
            res.status(200).json({
                status: true,
                termino
            });
        });
});


module.exports = app;