'use stric';
const moment = require('moment');
const { Cuenta } = require('../models/cuenta');

exports.agregaCuenta = function(req, res) {
    console.log(req);
    let body = req.body;

    cantidad = 4;
    fecha = body.fecha;
    fechaVencimiento = moment(body.fechaVencimiento);
    monto = body.monto;
    saldo = body.monto;
    origen = body.origen;
    origenID = body.origenID;
    tipo = body.tipo;
    acreedor = body.acreedor;
    deudor = body.deudor;

    cuenta = [];

    for (let i = 0; i < cantidad; i++) {
        cuentaNew = {
            fecha: moment(fecha).add(i, 'M'),
            tipo,
            origen,
            origenID,
            operacionID: i + 1,
            acreedor,
            deudor,
            monto,
            saldo: monto
        };
        cuenta.push(cuentaNew);
    }

    Cuenta.insertMany(cuenta, (err, cuentas) => {
        if (err) {
            res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            cuentas
        });
    });

}


// function getUser(req, res) {
//     var userId = req.params.id;
//     //buscar un documento por un  id
//     Cuenta.findById(userId, (err, user) => {
//         if (err) return res.status(500).send({ message: 'Error en la petición' });
//         if (!user) return res.status(404).send({ message: 'EL usuario no existe' });
//         followThisUser(req.user.sub, userId).then((value) => {
//             user.password = undefined;
//             return res.status(200).send({
//                 user,
//                 following: value.following,
//                 followed: value.followed
//             });
//         });

//     });
// }

// function saludar(req, res) {
//     return res.json({
//         ok: 'saludar'
//     });
// }