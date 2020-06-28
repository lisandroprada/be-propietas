const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let personaSchema = new Schema({
    nombre: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Persona', personaSchema);