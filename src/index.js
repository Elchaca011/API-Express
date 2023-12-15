
//importo modulos de express
const express = require('express');
const app = express();

//importo las rutas de las categorias
const categoriaRouters = require('./routes/categoria.router.js');

//Middleware
app.use(express.json()); //interpreta los datos del body en formato JSON 
app.use(categoriaRouters);

app.get('/', (req, res)=>{
    res.send('<h1> Mi primera api con node! </h1>');
});


// define el puerto de escucha del server
const port = 1111;



//manejo del error 404 
app.use('*', (req, res)=>{
    res.status(404).send('not found');
});


app.listen(port, ()=>{
    console.log(`listen on port ${port}`);
});