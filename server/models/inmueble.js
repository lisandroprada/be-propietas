const mongoose = require('mongoose');

var Schema = mongoose.Schema;


var contactoSchema = new Schema({
    _id: { type: String },
    fullName: { type: String }
})


var InmuebleSchema = new Schema({
    id: { type: String, required: false },
    address: { type: String, required: false },
    contacto: {
        _id: { type: Schema.Types.ObjectId, ref: 'Cliente' },
        fullName: { type: String }
    },
    postal_code: { type: String, required: false },
    phone: { type: String, required: false },
    obs: { type: String, required: false },
    descripcion: { type: String, required: false },
    customer: [{ type: String, required: false }],
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    camuzzi_id: { type: String, required: false },
    muni_id: { type: String, required: false },
    coop_id: { type: String, required: false },
    camuzzi_share: { type: String, required: false },
    coop_share: { type: String, required: false },
    muni_share: { type: String, required: false },
    publica: { type: String, required: false },
    status: { type: String, required: false },
    cliente: [{ _id: { type: Schema.Types.ObjectId, ref: 'Cliente' } }, { fullName: { type: String, default: 'defecto' } }],
    uuid: { type: String, required: false },
    img: { type: String, required: false }
});



let InmuebleViewsSchema = Schema({
    address: { type: String },
    img: { type: String },
    city: { type: String },
    state: { type: String },
    fullName: { type: String }

});

const reqInmueblesSchema = mongoose.model('Inmueble', InmuebleSchema);
const reqInmueblesViewSchema = mongoose.model('InmueblesViewSchema', InmuebleViewsSchema, 'inmueblesViews');
module.exports = {
    ReqInmueblesSchema: reqInmueblesSchema,
    ReqInmueblesViewSchema: reqInmueblesViewSchema
}