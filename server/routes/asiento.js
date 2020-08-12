const express = require('express');
const Asiento = require('../models/asiento');
const app = express();

// Obtiene asientos
app.get('/asiento', (req, res) => {
    Asiento.find()
        .exec((err, asientos) => {
            res.json({
                asientos
            });
        });
});

app.get('/asiento/suma', (req, res) => {

    let id = req.body.id;
    let filter = { 'cliente': Number(id) };

    Asiento
        .aggregate([{
            $match: filter
        }, {
            $group: {
                _id: { cliente: "$cliente" },
                montoTotal: { $sum: "$monto" },
                count: { $sum: 1 }
            }
        }])
        .exec((err, asientos) => {
            res.json({
                asientos
            });
        });
});

app.post('/asiento', (req, res) => {
    let body = req.body;
    console.log(body);
    res.json({
        body
    })
})

module.exports = app;