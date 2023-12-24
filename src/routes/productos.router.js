//importo modulo de express
const express = require('express');
const { Router } = express;

//importo el controlador
const productoController = require('../controllers/producto.controller');

//creo el objeto Router
const router = Router();


/**
 *  GET /productos -> getAll() OK
 *  POST /productos -> insert() OK
 *  GET /productos/:id -> get(:id) OK
 *  PUT /productos/:id -> post(:id) OK
 *  DELETE /productos/:id -> delete(:id) OK
 */


router.get('/productos', (req, res)=>{
    productoController.getAll(req, res);
});

router.post('/productos', (req, res)=>{
    productoController.insert(req, res);
});

router.get('/productos/:id', (req, res)=>{
    productoController.get(req, res);
});

router.get('/productosByCategoria/:id_categoria', (req, res)=>{
    productoController.getProductoByCategoria(req, res);
});

router.delete('/productos/:id', (req, res)=>{
    productoController.remove(req, res);
});

router.put('/productos/:id', (req, res)=>{
    productoController.update(req, res);
});

module.exports = router;