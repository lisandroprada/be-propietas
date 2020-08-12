const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let asientoSchema = new Schema({
    cliente: { type: Number },
    monto: { type: Number }
});

module.exports = mongoose.model('Asiento', asientoSchema);