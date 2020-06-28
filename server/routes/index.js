const express = require('express');
const app = express();


app.use(require('./login'));
app.use(require('./usuario'));
app.use(require('./categoria'));
app.use(require('./persona'));
app.use(require('./contrato'));
app.use(require('./producto'));
app.use(require('./upload'));
app.use(require('./imagenes'));

module.exports = app;