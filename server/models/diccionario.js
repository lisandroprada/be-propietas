var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var diccionarioSchema = new Schema({
    termino: { type: String, required: [true, 'El nombre es necesario'] },
    numero: {
        s: {
            m: { type: String },
            f: { type: String }
        },
        p: {
            m: { type: String },
            f: { type: String }
        }
    }
});


module.exports = mongoose.model('Diccionario', diccionarioSchema, 'diccionario');