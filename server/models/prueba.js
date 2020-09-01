const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CasaSchema = new Schema({
  address: { type: String },
  contacto: [{ type: Schema.Types.ObjectId, ref: 'Persona' }],
});

var PersonaSchema = new Schema({
  nombre: { type: String },
});

const Casa = mongoose.model('Casa', CasaSchema);
const Persona = mongoose.model('Persona', PersonaSchema);
module.exports = { Casa: Casa, Persona: Persona };
