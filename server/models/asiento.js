const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let asientoSchema = new Schema({
    cliente: { type: Number },
    monto: { type: Number },
    creadoEn: { type: Date, default: Date.now() - 3 * 60 * 60 * 1000 }
});

module.exports = mongoose.model('Asiento', asientoSchema);