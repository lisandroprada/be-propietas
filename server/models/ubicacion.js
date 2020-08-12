const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ubicacionSchema = new Schema({
    iso_31662: { type: String },
    provincia: { type: String },
    capital: { type: String },
    localidad: { type: [] }
});

module.exports = mongoose.model('Ubicacion', ubicacionSchema, 'ubicacion');