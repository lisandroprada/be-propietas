const express = require('express');
const moment = require('moment');
var CuentaController = require('../controllers/cuenta');

const { Contrato, ContratoModelo } = require('../models/contrato');
const { Cuenta } = require('../models/cuenta');


const app = express();

// Obtiene la lista de contratos
app.get('/contrato', (req, res) => {

    let pageSize = req.query.pageSize || 0;
    pageSize = Number(pageSize);

    let currentPage = req.query.currentPage || 1;
    currentPage = Number(currentPage);

    let saltar = (currentPage - 1) * pageSize;

    let search = req.query.search || '';
    let regex = new RegExp(search, 'i');

    let termino = { $or: [{ contrato: regex }, { inmuebleDireccion: regex }] };

    Contrato.find(termino)
        .skip(saltar)
        .limit(pageSize)
        .sort()
        .exec((err, contratos) => {
            if (err) {
                return res.status.json({
                    ok: false,
                    err
                });
            }
            Contrato.countDocuments(termino, (err, conteo) => {
                let totalPage = Math.ceil(conteo / pageSize);
                res.json({
                    status: true,
                    totalItem: conteo,
                    totalPage: totalPage,
                    pageSize: pageSize.toString(),
                    currentPage: currentPage.toString(),
                    contratos
                });
            });
        })
})

app.post('/prueba2', (req, res) => {
    let body = req.body;

    let contrato = new Contrato({
        contrato: body.locador + body.locatario,
        tipo: body.tipo,
        duracion: body.duracion,
        estado: body.estado,
        fechaAlta: body.fechaAltaDateTime,
        fechaInicio: body.fechaInicio,
        fechaFinalizacion: body.fechaFinalizacion,
        inmueble: body.inmueble,
        inmuebleDireccion: body.inmuebleDireccion,
        fiador: body.fiador,
        montoAlquiler: body.montoAlquiler,
        montoActualizacion: body.montoActualizacion,
        periodoActualizaciom: body.periodoActualizaciom,
        interesMora: body.interesMora,
        administracion: body.administracion,
        usuario: body.usuario
    })

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

        data = [{
            body: req.body,
            tipo: 'Alquiler',
            origen: contratoDB._id,
            acreedor: contratoDB.locador[0],
            deudor: contratoDB.locatario[0]
        }]

        CuentaController.agregaCuenta(data, res)
        res.status(200).json({
            ok: true,
            contratoDB
        });
    })
});


// Obtiene modelo - texto contratos
app.get('/contrato/modelo', (req, res) => {

    let search = req.query.search;
    let regex = new RegExp(search, 'i');
    let termino = { tipo: regex };
    ContratoModelo.find(termino, 'texto')
        .exec((err, contratoModelo) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.status(200).json({
                status: true,
                contratoModelo
            });
        });
})


module.exports = app;