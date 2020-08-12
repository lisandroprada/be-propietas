const express = require('express');

const { ReqClientesSchema, ReqClientesViewSchema } = require('../models/cliente');

const app = express();

// Obtener todos los clientes
app.get('/cliente', (req, res) => {

    let pageSize = req.query.pageSize || 0;
    pageSize = Number(pageSize);

    let currentPage = req.query.currentPage || 1;
    currentPage = Number(currentPage);

    let saltar = (currentPage - 1) * pageSize;

    let search = req.query.search || '';
    let regex = new RegExp(search, 'i');

    let termino = { $or: [{ identityCard: regex }, { fullName: regex }] };

    ReqClientesViewSchema.find(termino)
        .skip(saltar)
        .limit(pageSize)
        .sort()
        .exec((err, clientes) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            ReqClientesViewSchema.countDocuments(termino, (err, conteo) => {
                let totalPage = Math.ceil(conteo / pageSize);
                res.json({
                    status: true,
                    totalItem: conteo,
                    totalPage: totalPage,
                    pageSize: pageSize.toString(),
                    currentPage: currentPage.toString(),
                    clientes
                });
            });
        })
});

app.get('/cliente/buscar/:termino', (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    ReqClientesSchema.find({ $or: [{ customerName: regex }, { customerLastName: regex }] })
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            ReqClientesSchema.countDocuments({ $or: [{ customerName: regex }, { customerLastName: regex }] })
                .exec((err, conteo) => {
                    res.json({
                        status: true,
                        totalItem: conteo,
                        totalPage: totalPage,
                        pageSize: pageSize.toString(),
                        currentPage: currentPage.toString(),
                        clientes
                    });
                });
        });
});

app.get('/cliente/:id', (req, res) => {
    var id = req.params.id;

    ReqClientesSchema.findById(id)
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar cliente',
                    errors: err
                });
            }

            if (!clientes) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'El cliente con el id' + id + ' no existe',
                    errors: { message: 'No existe un cliente con ese ID' }
                });
            }

            return res.status(200).json({
                status: true,
                clientes: clientes
            });
        })
})

app.post('/cliente', (req, res) => {

    let body = req.body.cliente;

    let cliente = new ReqClientesSchema({
        fullName: body.customerName + ' ' + body.customerLastName,
        customerName: body.customerName,
        customerLastName: body.customerLastName,
        phone: body.phone,
        email: body.email,
        identityCard: body.identityCard
    });

    cliente.save((err, clienteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            cliente: clienteDB
        });
    });
});

// Actualiza Cliente
app.put('/cliente/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body.cliente;

    ReqClientesSchema.findByIdAndUpdate(id, body, { new: true }, (err, clienteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: { message: 'ID inválido' }
            });
        }
        res.json({
            ok: true,
            cliente: clienteDB
        });
    });

});

// Ruta de búsqueda de prueba
app.get('/clientes/prueba/:termino', (req, res) => {

    let termino = req.params.termino;
    let clause = [{
            $project: {
                fullName: { $concat: ["$customerName", " ", "$customerLastName"] }
            }
        },
        { $match: { fullName: new RegExp(termino, 'i') } }
        // { $skip: saltar },
        // { $limit: pageSize }
    ];
    ReqClientesSchema.aggregate(clause)
        .exec((err, clientes) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                clientes
            });
        })
});

module.exports = app;



// db.createView(
//     "inmueblesViews",
//     "inmuebles", [
//         { $lookup: { from: "clientes", localField: "id", foreignField: "customer", as: "cliente" } },
//         { $project: { "inventory_docs._id": 0, "inventory_docs.address": 0 } }
//     ]
// )

// //  db.createView ("inmueblesViews","inmuebles", [{ $lookup: { from: "clientes", localField: "id", foreignField: "customer", as: "cliente" } },{ $project: { "inventory_docs.id": 0, "inventory_docs.customer": 0 } }])

//  db.createView('clientesView','clientes', [{ $project : { "fullName" : {$concat : ["$customerName", " ", "$customerLastName"]}, phone: 1, identityCard: 1}}])db.inmueblesViews.drop();

//  db.inmuebles.aggregate([
//      {
//          "$lookup": {
//              "from": "clientes",
//              "localField": "customer",
//              "foreignField": "id",
//              "as": "cliente"
//          }
//      },
//      { "$unwind": "$cliente" },
//      { "$project": 
//          {"fullname": { "$concat": [ "$cliente.customerName", " ", "$cliente.customerLastName" ]},
//          address: 1,
//          city: 1,
//          state: 1
//          },
//      }
//  ]).saveAsView("inmueblesViews");


// Buscar concatenados por match
// reportRoutes.route('/:id').get(async (req, res) => {
//     try{
//         let id = req.params.id
//         let author = req.params.author
//         let regex = new RegExp( id, 'i')
//         const report = await Report.find({ title: regex })
//         .populate({path: 'like'})
//         .populate({
//            path: 'player',
//            match: { 'player_name': 'James Harden'},  // <-- match here
//            populate: [{ path: 'team' },
//            {
//              path: 'team',
//              populate: {
//              path: 'league'
//            }
//          }]
//         })
//         res.json(report)
//     }  catch (e) {
//         res.status(500).send()
//     }
// })