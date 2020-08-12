require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
});


const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


// Routes - Configuración global de rutas
app.use(require('./routes/index'));

const port = process.env.PORT;

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// Mongo Atlas password 
// User: lisandro
// Password: vrvci2LdHQYNRWNq

// mongodb+srv://lisandro:<password>@cluster0-7e9ez.gcp.mongodb.net/cafe