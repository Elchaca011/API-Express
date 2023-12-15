const categoriaModel = require('../models/categoria.model');

async function getAll(req, res){
    const categorias = await categoriaModel.getAll(); //traigo todas las categorias
    res.send(categorias);
}

async function get(req, res){
    const id = req.params.id;
    const categoria = await categoriaModel.get(id);
    //validacion
    if (!categoria) {
        res.status(404).send(`La categoria con el id=${id} no existe`);
        return;
    }
    res.send(categoria);
}

async function insert(req, res){
    //utilizo una excepcion para manejar posibles errores
    try {
        const categoriaNueva = req.body; //aca viene el objeto json mandado en el body por el cliente
        const insertID = await categoriaModel.insert(categoriaNueva);
        console.log(req.body);
        res.status(201).send(`Categoria agregada correctamanete con el id= ${insertID}`);
    } catch (error) {
        res.status(404).send(`La categoria no pudo ser insertada`);
    }
}

async function remove(req, res){
    const id = req.params.id;
    const result = await categoriaModel.remove(id); //esto me trae el resultado de filas afectadas
    //validacion
    if(result <= 0){
        res.status(404).send(`La categoria no pudo ser eliminada`);
        return;
    }
    res.send(`se elimino la categoria con el id ${id}.`);
}

async function update(req, res){
    const id = req.params.id;
    const categoriaMod = req.body; //aca viene el objeto json mandado en el body por el cliente
    const result = await categoriaModel.update(id, categoriaMod);
    //validacion
    if(result <= 0){
        res.status(404).send(`La categoria no pudo ser modificada`);
        return;
    }
    res.send(`se modifco la categoria con el id = ${id}.`);
}

//exporto las funciones
module.exports = {
    getAll,
    get,
    insert,
    remove,
    update,
}