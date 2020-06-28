const express = require('express');

let Contrato = require('../models/contrato');
const { populate } = require('../models/contrato');

const app = express();

// Obtiene contatos
app.get('/contrato', (req, res) => {

    Contrato.find()
        .populate('locador', 'nombre')
        .populate('locatario', 'nombre')
        .exec((err, contratos) => {
            if (err) {
                return status(400).json({
                    ok: false,
                    err
                });
            }

            Contrato.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    contratos,
                    cuanto: conteo
                });
            });
        })
})


// Crea contrato
app.post('/contrato', (req, res) => {
    let body = req.body;

    let contrato = new Contrato({
        contrato: body.contrato,
        locatario: body.locatario,
        locador: body.locador
    });

    contrato.save((err, contratoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!contratoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            contrato: contratoDB
        });
    })
})

module.exports = app;