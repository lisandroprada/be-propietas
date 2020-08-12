const express = require('express');

const { ReqInmueblesSchema, ReqInmueblesViewSchema } = require('../models/inmueble');

const app = express();

// Obtener todos los inmuebles
app.get('/inmueble', (req, res) => {

    let pageSize = req.query.pageSize || 0;
    pageSize = Number(pageSize);

    let currentPage = req.query.currentPage || 1;
    currentPage = Number(currentPage);

    let saltar = (currentPage - 1) * pageSize;

    let search = req.query.search || '';
    let regex = new RegExp(search, 'i');

    let termino = { $or: [{ address: regex }, { fullName: regex }] };

    ReqInmueblesViewSchema.find(termino)
        .skip(saltar)
        .limit(pageSize)
        .sort()
        .exec((err, inmuebles) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            ReqInmueblesViewSchema.countDocuments(termino, (err, conteo) => {
                let totalPage = Math.ceil(conteo / pageSize);
                res.json({
                    status: true,
                    totalItem: conteo,
                    totalPage: totalPage,
                    pageSize: pageSize.toString(),
                    currentPage: currentPage.toString(),
                    inmuebles
                });
            });
        });
});

app.get('/inmueble/:id', (req, res) => {
    var id = req.params.id;

    ReqInmueblesSchema.findById(id)
        .exec((err, inmueble) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar inmueble',
                    errors: err
                });
            }

            if (!inmueble) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El inmueble con el id' + id + ' no existe',
                    errors: { message: 'No existe un inmueble con ese ID' }
                });
            }
            console.log(inmueble);
            return res.status(200).json({
                status: true,
                inmueble: inmueble
            });
        })
})


// Ruta de búsqueda y concat prueba
app.get('/inmuebles/prueba/:termino', (req, res) => {
    let termino = req.params.termino;
    let clause = [{
            $lookup: {
                from: "clientes",
                localField: "customer",
                foreignField: "id",
                as: "cliente"
            }
        },
        {
            $unwind: "$cliente"
        },
        {
            $project: {
                fullName: { $concat: ["$cliente.customerName", " ", "$cliente.customerLastName"] },
                address: 1,
                city: 1,
                state: 1
            }
        },
        { $match: { fullName: new RegExp(termino, 'i') } }
    ];

    ReqInmueblesSchema.aggregate(clause)
        .exec((err, inmuebles) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                inmuebles
            });
        })
});


app.post('/inmueble', (req, res) => {
    let body = req.body;

    let inmueble = new ReqInmueblesSchema({
        address: body.address,
        state: body.state,
        city: body.city,
        contacto: body.contacto._id
    });

    inmueble.save((err, inmuebleDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            inmueble: inmuebleDB
        });
    });
});

// Actualiza inmueble
app.put('/inmueble/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body.inmueble;
    console.log(id);
    console.log(body);

    ReqInmueblesSchema.findByIdAndUpdate(id, body, { new: true }, (err, inmuebleDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: { message: 'ID no válido' }
            });
        }
        if (!inmuebleDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            inmueble: inmuebleDB
        });
    });
});




module.exports = app;