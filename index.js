const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();


//Crear express server
const app = express();

//Database
dbConnection();

//CORS
app.use(cors())

//Directorio publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
//! auth
app.use('/api/auth', require('./routes/auth'));
//! crud -> eventos
app.use('/api/events', require('./routes/events'));

//escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log("Servidor en puerto:", process.env.PORT);
})