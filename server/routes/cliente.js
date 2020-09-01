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
          err,
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
          clientes,
        });
      });
    });
});

app.get('/cliente/buscar/:termino', (req, res) => {
  let termino = req.params.termino;

  let regex = new RegExp(termino, 'i');

  ReqClientesSchema.find({
    $or: [{ customerName: regex }, { customerLastName: regex }],
  }).exec((err, clientes) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }
    ReqClientesSchema.countDocuments({
      $or: [{ customerName: regex }, { customerLastName: regex }],
    }).exec((err, conteo) => {
      res.json({
        status: true,
        totalItem: conteo,
        totalPage: totalPage,
        pageSize: pageSize.toString(),
        currentPage: currentPage.toString(),
        clientes,
      });
    });
  });
});

app.get('/cliente/:id', (req, res) => {
  var id = req.params.id;

  ReqClientesSchema.findById(id).exec((err, clientes) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar cliente',
        errors: err,
      });
    }

    if (!clientes) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El cliente con el id' + id + ' no existe',
        errors: { message: 'No existe un cliente con ese ID' },
      });
    }

    return res.status(200).json({
      status: true,
      clientes: clientes,
    });
  });
});

app.post('/cliente', (req, res) => {
  let body = req.body.cliente;

  let cliente = new ReqClientesSchema({
    fullName: body.customerName + ' ' + body.customerLastName,
    customerName: body.customerName,
    customerLastName: body.customerLastName,
    phone: body.phone,
    email: body.email,
    identityCard: body.identityCard,
  });

  cliente.save((err, clienteDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    res.json({
      ok: true,
      cliente: clienteDB,
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
        err: { message: 'ID inválido' },
      });
    }
    res.json({
      ok: true,
      cliente: clienteDB,
    });
  });
});

// Ruta de búsqueda de prueba
app.get('/clientes/prueba', (req, res) => {
  let pageSize = Number(req.query.pageSize) || 5;
  let currentPage = Number(req.query.currentPage) || 1;

  let saltar = (currentPage - 1) * pageSize;

  let search = req.query.search || '';
  let regex = new RegExp(search, 'i');
  let termino = { $or: [{ identityCard: regex }, { fullName: regex }, { mobilephone: regex }] };

  let clause = [
    {
      $project: {
        fullName: { $concat: ['$customerName', ' ', '$customerLastName'] },
        addressLine1: 1,
        mobilephone: 1,
        identityCard: 1,
      },
    },
    { $match: termino },
    { $sort: { customerLastName: -1 } },
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: saltar }, { $limit: pageSize }],
      },
    },
  ];

  ReqClientesSchema.aggregate(clause).exec((err, clientes) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err,
      });
    }

    totalItem = clientes[0].data.length === 0 ? 0 : (totalItem = clientes[0].metadata[0].total);
    totalPage = totalItem === 0 ? 0 : totalItem / pageSize;

    res.json({
      status: true,
      totalItem: totalItem,
      totalPage: totalPage,
      pageSize: pageSize,
      clientes: clientes[0].data,
    });
  });
});

module.exports = app;
