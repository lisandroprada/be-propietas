const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let clienteSchema = new Schema({
    customerName: { type: String, required: false },
    customerLastName: { type: String, required: false },
    companyName: { type: String, required: false },
    apoderado: { type: Schema.Types.ObjectId, ref: 'Cliente' },
    identityCard: { type: String, required: false },
    identityCardType: { type: String, required: false },
    tax_id: { type: String, required: false },
    tax_type: { type: String, required: false },
    gender: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    phone: { type: String, required: false },
    mobilephone: { type: String, required: false },
    addressLine1: { type: String, required: false },
    postalCode: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    work: { type: String, required: false },
    workAddress: { type: String, required: false },
    workPhone: { type: String, required: false },
    email: { type: String, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    factura: { type: String, required: false },
    iva: { type: String, required: false }
});


let clienteViewSchema = Schema({
    fullName: { type: String },
    phone: { type: String },
    identityCard: { type: String },
})

const reqClientesSchema = mongoose.model('Cliente', clienteSchema);
const reqClientesViewSchema = mongoose.model('ClientesView', clienteViewSchema, 'clientesView');
module.exports = {
    ReqClientesSchema: reqClientesSchema,
    ReqClientesViewSchema: reqClientesViewSchema
};