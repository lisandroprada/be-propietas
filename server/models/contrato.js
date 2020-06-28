const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let contratoSchema = new Schema({
    contrato: {
        type: String,
        required: [true, 'El contrato es necesario']
    },
    estado: {
        type: Boolean,
        default: true
    },
    locatario: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    },
    locador: {
        type: Schema.Types.ObjectId,
        ref: 'Persona'
    }
});

module.exports = mongoose.model('Contrato', contratoSchema);