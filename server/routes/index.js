const express = require('express');
const app = express();

app.use(require('./login'));
app.use(require('./usuario'));

app.use(require('./cliente'));
app.use(require('./contrato'));
app.use(require('./inmueble'));
app.use(require('./asiento'));

app.use(require('./ubicacion'));

app.use(require('./categoria'));
app.use(require('./producto'));

app.use(require('./diccionario'));

app.use(require('./upload'));
app.use(require('./imagenes'));

app.use(require('./prueba'));

module.exports = app;
