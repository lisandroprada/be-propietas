const mongoose = require('mongoose');
const { Decimal128 } = require('mongodb');

let Schema = mongoose.Schema;

let contratoSchema = new Schema({
    contrato: { type: String, required: [true, 'El contrato es necesario'] },
    tipo: { type: String },
    duracion: { type: Number },
    estado: { type: Boolean, default: true },
    fechaAlta: { type: Date, default: Date.now() - 3 * 60 * 60 * 1000 },
    fechaInicio: { type: Date },
    fechaFinalizacion: { type: Date },
    inmueble: { type: Schema.Types.ObjectId, ref: 'Inmueble' },
    inmuebleDireccion: { type: String },
    locatario: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
    locador: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
    fiador: [{ type: Schema.Types.ObjectId, ref: 'Cliente' }],
    montoAlquiler: { type: Decimal128 },
    montoActualizacion: { type: Decimal128 },
    periodoActualizaciom: { type: Number },
    interesMora: { type: Number },
    administracion: { type: Decimal128 },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
});

let contratoModeloSchema = new Schema({
    tipo: { type: String },
    titulo: { type: String },
    texto: { type: String }
});

const Contrato = mongoose.model('Contrato', contratoSchema);
const ContratoModelo = mongoose.model('ContratoModelo', contratoModeloSchema, 'modeloContrato')

module.exports = {
    Contrato: Contrato,
    ContratoModelo: ContratoModelo
}