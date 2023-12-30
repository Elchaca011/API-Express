//importo modulo de express
const express = require('express');
const { Router } = express;

//importo los controladores
const categoriaController = require('../controllers/categoria.controller');
//creo el objeto Router
const router = Router();

/**
 *  GET /categorias -> getAll() OK
 *  POST /categorias -> insert() OK
 *  GET /categorias/:id -> get(:id) OK
 *  PUT /categorias/:id -> post(:id) OK
 *  DELETE /categorias/:id -> delete(:id) OK
 */



router.get('/categorias', (req, res)=>{
    res.header('Access-Control-Allow-Origin', '*'); //Solucion al problema CORS
    categoriaController.getAll(req, res);
});

router.post('/categorias', (req, res)=>{
    categoriaController.insert(req, res);
})

router.get('/categorias/:id', (req, res)=>{
    categoriaController.get(req, res);
});

router.delete('/categorias/:id', (req, res)=>{
    categoriaController.remove(req, res);
});

router.put('/categorias/:id', (req, res)=>{
    categoriaController.update(req, res);
});


module.exports = router;