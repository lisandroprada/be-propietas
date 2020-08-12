const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let cuentaSchema = new Schema({

    tipo: { type: String, required: true },
    origen: { type: String },
    origenID: { type: String },
    operacionID: { type: String },
    fecha: { type: Date, default: Date.now() - 3 * 60 * 60 * 1000 },
    fechaVencimiento: { type: Date, default: Date.now() - 3 * 60 * 60 * 1000 },
    acreedor: { type: Number },
    deudor: { type: Number },
    monto: { type: Number },
    saldo: { type: Number }

});

const Cuenta = mongoose.model('Cuenta', cuentaSchema);

module.exports = {
    Cuenta
}